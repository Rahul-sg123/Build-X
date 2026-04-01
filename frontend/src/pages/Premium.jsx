import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { upgradeToPremium } from '../services/api';
import { Crown, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Premium() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await upgradeToPremium();
      setUser(response.data.user);
      alert('Successfully upgraded to Premium!');
      navigate('/ideas');
    } catch (error) {
      alert(error.response?.data?.error || 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  if (user.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Crown className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Premium!</h1>
          <p className="text-gray-600 mb-6">
            You already have access to all premium features.
          </p>
          <Link
            to="/ideas"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="max-w-4xl mx-auto p-6">
        <Link
          to="/ideas"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Ideas</span>
        </Link>

        <div className="text-center mb-12">
          <div className="p-4 bg-yellow-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Crown className="text-yellow-600" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited access to AI-generated startup ideas and detailed insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Innovator</h3>
              <div className="text-3xl font-bold text-gray-600">$0</div>
              <div className="text-gray-500">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 flex-shrink-0" size={20} />
                <span>Access to chat platform</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 flex-shrink-0" size={20} />
                <span>1 Idea of the Day</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-green-500 flex-shrink-0" size={20} />
                <span>Basic idea preview</span>
              </li>
            </ul>

            <div className="text-center">
              <div className="text-gray-500 font-medium">Current Plan</div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-white text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                Recommended
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium Innovator</h3>
              <div className="text-3xl font-bold">$9.99</div>
              <div className="text-yellow-100">per month</div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="text-white flex-shrink-0" size={20} />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-white flex-shrink-0" size={20} />
                <span>3 AI ideas daily</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-white flex-shrink-0" size={20} />
                <span>Full idea details & analysis</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-white flex-shrink-0" size={20} />
                <span>Market insights</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="text-white flex-shrink-0" size={20} />
                <span>Source conversation context</span>
              </li>
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-white text-yellow-600 py-3 rounded-lg font-bold hover:bg-gray-50 transition disabled:opacity-50"
            >
              {loading ? 'Upgrading...' : 'Upgrade Now'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="text-blue-600" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Ideas</h3>
              <p className="text-gray-600">
                Get access to carefully analyzed startup ideas with detailed market insights
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="text-green-600" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real Conversations</h3>
              <p className="text-gray-600">
                Ideas extracted from genuine human discussions, not random AI generation
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="text-purple-600" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Detailed Analysis</h3>
              <p className="text-gray-600">
                Complete breakdown including problem, solution, market, and growth potential
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}