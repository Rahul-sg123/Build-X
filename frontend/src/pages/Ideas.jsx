import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIdeas, getIdeaDetails } from '../services/api';
import IdeaCard from '../components/IdeaCard';
import { Lightbulb, Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Ideas() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewStats, setViewStats] = useState({ limit: 0, viewedToday: 0 });

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const response = await getIdeas();
      setIdeas(response.data.ideas);
      setViewStats({
        limit: response.data.limit,
        viewedToday: response.data.viewedToday
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (ideaId) => {
    if (!user.isPremium) {
      alert('Premium subscription required for full details');
      return;
    }

    try {
      const response = await getIdeaDetails(ideaId);
      setSelectedIdea(response.data.idea);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to load idea details');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading ideas...</div>
      </div>
    );
  }

  if (selectedIdea) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => setSelectedIdea(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Ideas</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Lightbulb className="text-yellow-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedIdea.ideaTitle}
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem Detected</h3>
                <p className="text-gray-700 leading-relaxed">{selectedIdea.problemDetected}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Startup Solution</h3>
                <p className="text-gray-700 leading-relaxed">{selectedIdea.startupSolution}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Potential Market</h3>
                <p className="text-gray-700 leading-relaxed">{selectedIdea.potentialMarket}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Future Scope</h3>
                <p className="text-gray-700 leading-relaxed">{selectedIdea.futureScope}</p>
              </div>

              {selectedIdea.conversationSnippet && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Source Conversation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm italic">
                      "{selectedIdea.conversationSnippet}..."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Link
              to="/chat"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>Back to Chat</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Ideas viewed today: {viewStats.viewedToday}/{viewStats.limit}
            </div>
            {!user.isPremium && (
              <Link
                to="/premium"
                className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                <Crown size={16} />
                <span>Upgrade to Premium</span>
              </Link>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-4 bg-yellow-100 rounded-full">
              <Lightbulb className="text-yellow-600" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Startup Ideas</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover innovative startup ideas extracted from real human conversations using AI analysis
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Lightbulb size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No ideas available yet
            </h3>
            <p className="text-gray-500">
              Start chatting to generate new startup ideas!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map(idea => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                onViewDetails={handleViewDetails}
                isPremium={user.isPremium}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}