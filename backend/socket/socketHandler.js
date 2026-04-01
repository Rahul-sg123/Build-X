require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { analyzeConversation } = require('../services/geminiService');
const Idea = require('../models/Idea');

const MESSAGE_BATCH_SIZE = 5; // Analyze every 5 messages

const setupSocket = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Broadcast user online status
    io.emit('user_status', {
      userId: socket.userId,
      isOnline: true
    });

    // Join user to their personal room
    socket.join(socket.userId.toString());

    // Handle joining a chat room
    socket.on('join_chat', async (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content } = data;

        // Create message
        const message = new Message({
          chat: chatId,
          sender: socket.userId,
          content: content.trim()
        });

        await message.save();
        await message.populate('sender', 'name email');

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          lastMessageTime: new Date()
        });

        // Emit message to chat room
        io.to(chatId).emit('new_message', message);

        // Check if we should analyze for ideas
        const messageCount = await Message.countDocuments({ 
          chat: chatId,
          analyzedForIdeas: false 
        });

        if (messageCount >= MESSAGE_BATCH_SIZE) {
          // Get recent unanalyzed messages
          const messages = await Message.find({
            chat: chatId,
            analyzedForIdeas: false
          })
            .sort({ createdAt: 1 })
            .limit(MESSAGE_BATCH_SIZE)
            .populate('sender', 'name');

          // Build conversation text
          const conversationText = messages
            .map(msg => `${msg.sender.name}: ${msg.content}`)
            .join('\n');

          // Analyze with Gemini
          const ideaData = await analyzeConversation(conversationText);

          if (ideaData) {
            // Save idea
            const idea = new Idea({
              ...ideaData,
              sourceChat: chatId,
              conversationSnippet: conversationText.substring(0, 500)
            });

            await idea.save();
            console.log('New idea detected:', idea.ideaTitle);

            // Notify innovators
            io.emit('new_idea_detected', {
              message: 'A new startup idea has been discovered!'
            });
          }

          // Mark messages as analyzed
          await Message.updateMany(
            { _id: { $in: messages.map(m => m._id) } },
            { analyzedForIdeas: true }
          );
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.name
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.chatId).emit('user_stop_typing', {
        userId: socket.userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      io.emit('user_status', {
        userId: socket.userId,
        isOnline: false
      });
    });
  });
};

module.exports = setupSocket;
