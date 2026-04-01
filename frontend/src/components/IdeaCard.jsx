import { Lightbulb, Eye, Lock } from 'lucide-react';

export default function IdeaCard({ idea, onViewDetails, isPremium }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start space-x-3 mb-4">
        <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
          <Lightbulb className="text-yellow-600" size={20} />
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-tight">
          {idea.ideaTitle}
        </h3>
      </div>

      <p className="text-gray-600 mb-6 line-clamp-3">
        {idea.problemDetected}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {new Date(idea.createdAt).toLocaleDateString()}
        </div>
        
        {isPremium ? (
          <button
            onClick={() => onViewDetails(idea._id)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 text-gray-400">
            <Lock size={16} />
            <span className="text-sm">Premium Only</span>
          </div>
        )}
      </div>
    </div>
  );
}