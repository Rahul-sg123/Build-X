import { useState, useEffect, useRef } from 'react';
import { getMessages } from '../services/api';
import { getSocket } from '../services/socket';
import MessageBubble from './MessageBubble';
import { Send, Smile } from 'lucide-react';

export default function ChatWindow({ chat, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (chat) {
      loadMessages();
      joinChat();
      setupMessageListener();
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!chat) return;
    
    setLoading(true);
    try {
      const response = await getMessages(chat._id);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Load messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChat = () => {
    const socket = getSocket();
    if (socket && chat) {
      socket.emit('join_chat', chat._id);
    }
  };

  const setupMessageListener = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('new_message', (message) => {
      if (message.chat === chat?._id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('user_typing', ({ userId, userName }) => {
      if (userId !== currentUser.id) {
        setTyping(userName);
      }
    });

    socket.on('user_stop_typing', ({ userId }) => {
      if (userId !== currentUser.id) {
        setTyping(null);
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    const socket = getSocket();
    if (socket) {
      socket.emit('send_message', {
        chatId: chat._id,
        content: newMessage.trim()
      });
      setNewMessage('');
      handleStopTyping();
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket && chat) {
      socket.emit('typing', { chatId: chat._id });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping();
      }, 3000);
    }
  };

  const handleStopTyping = () => {
    const socket = getSocket();
    if (socket && chat) {
      socket.emit('stop_typing', { chatId: chat._id });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <MessageCircle size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Welcome to IdeaMining Machine
          </h3>
          <p className="text-gray-500">
            Select a chat or start a new conversation
          </p>
        </div>
      </div>
    );
  }

  const otherUser = chat.participants.find(p => p._id !== currentUser.id);

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium">
              {otherUser?.name.charAt(0).toUpperCase()}
            </div>
            {otherUser?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{otherUser?.name}</h2>
            <p className="text-sm text-gray-500">
              {otherUser?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender._id === currentUser.id}
              />
            ))}
            {typing && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>{typing} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onBlur={handleStopTyping}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageCircle({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}