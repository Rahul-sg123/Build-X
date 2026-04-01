import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createChat } from '../services/api';
import { MessageCircle, Users, Settings, LogOut, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChatSidebar({ chats, users, selectedChat, onSelectChat, onNewChat }) {
  const { user, logoutUser } = useAuth();
  const [showUsers, setShowUsers] = useState(false);

  const handleStartChat = async (userId) => {
    try {
      const response = await createChat(userId);
      onNewChat(response.data.chat);
      onSelectChat(response.data.chat);
      setShowUsers(false);
    } catch (error) {
      console.error('Start chat error:', error);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">IdeaMining</h1>
          <div className="flex items-center space-x-2">
            {user.role === 'innovator' && (
              <Link
                to="/ideas"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Ideas"
              >
                <Lightbulb size={20} />
              </Link>
            )}
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Users"
            >
              <Users size={20} />
            </button>
            <button
              onClick={logoutUser}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">
              {user.role === 'innovator' ? (user.isPremium ? 'Premium' : 'Free') : 'User'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showUsers ? (
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Start New Chat</h3>
              <div className="space-y-2">
                {users.map(u => (
                  <button
                    key={u._id}
                    onClick={() => handleStartChat(u._id)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">
                        {u.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Chats</h3>
              <div className="space-y-1">
                {chats.map(chat => {
                  const otherUser = chat.participants.find(p => p._id !== user.id);
                  return (
                    <button
                      key={chat._id}
                      onClick={() => onSelectChat(chat)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                        selectedChat?._id === chat._id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium">
                          {otherUser?.name.charAt(0).toUpperCase()}
                        </div>
                        {otherUser?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {otherUser?.name}
                        </div>
                        {chat.lastMessage && (
                          <div className="text-sm text-gray-500 truncate">
                            {chat.lastMessage.content}
                          </div>
                        )}
                      </div>
                      {chat.lastMessageTime && (
                        <div className="text-xs text-gray-400">
                          {formatTime(chat.lastMessageTime)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}