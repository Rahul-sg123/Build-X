import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import { getChats, getUsers } from '../services/api';
import { getSocket } from '../services/socket';

export default function Chat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    setupSocketListeners();
  }, []);

  const loadData = async () => {
    try {
      const [chatsRes, usersRes] = await Promise.all([
        getChats(),
        getUsers()
      ]);
      setChats(chatsRes.data.chats);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('new_message', (message) => {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === message.chat 
            ? { ...chat, lastMessage: message, lastMessageTime: message.createdAt }
            : chat
        )
      );
    });

    socket.on('user_status', ({ userId, isOnline }) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isOnline } : user
        )
      );
    });

    socket.on('new_idea_detected', (data) => {
      // Show notification for new idea
      if (user.role === 'innovator') {
        alert(data.message);
      }
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <ChatSidebar
        chats={chats}
        users={users}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onNewChat={(chat) => setChats(prev => [chat, ...prev])}
      />
      <ChatWindow
        chat={selectedChat}
        currentUser={user}
      />
    </div>
  );
}