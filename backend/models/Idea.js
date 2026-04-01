const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  ideaTitle: {
    type: String,
    required: true
  },
  problemDetected: {
    type: String,
    required: true
  },
  startupSolution: {
    type: String,
    required: true
  },
  potentialMarket: {
    type: String,
    required: true
  },
  futureScope: {
    type: String,
    required: true
  },
  sourceChat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  conversationSnippet: {
    type: String
  },
  isIdeaOfTheDay: {
    type: Boolean,
    default: false
  },
  ideaOfTheDayDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Idea', ideaSchema);
