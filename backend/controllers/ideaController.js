const Idea = require('../models/Idea');

const resetDailyViewCount = (user) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastViewDate = user.lastIdeaViewDate ? new Date(user.lastIdeaViewDate).setHours(0, 0, 0, 0) : null;

  if (!lastViewDate || lastViewDate < today) {
    user.ideasViewedToday = 0;
    user.lastIdeaViewDate = new Date();
    return true;
  }
  return false;
};

exports.getIdeas = async (req, res) => {
  try {
    const user = req.user;

    // Reset daily count if needed
    const wasReset = resetDailyViewCount(user);
    if (wasReset) {
      await user.save();
    }

    // Determine how many ideas user can view
    let limit = 0;
    if (user.isPremium) {
      limit = 3;
    } else {
      limit = 1; // Free innovators get 1 idea per day
    }

    // Check if user has reached daily limit
    if (user.ideasViewedToday >= limit) {
      return res.status(403).json({ 
        error: 'Daily idea limit reached',
        limit,
        viewedToday: user.ideasViewedToday
      });
    }

    // Get ideas
    let ideas;
    if (!user.isPremium) {
      // Free users get Idea of the Day
      ideas = await Idea.find({ isIdeaOfTheDay: true })
        .select('ideaTitle problemDetected')
        .limit(1);
    } else {
      // Premium users get latest ideas
      ideas = await Idea.find()
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    res.json({ 
      ideas,
      limit,
      viewedToday: user.ideasViewedToday,
      isPremium: user.isPremium
    });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
};

exports.getIdeaDetails = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const user = req.user;

    if (!user.isPremium) {
      return res.status(403).json({ error: 'Premium subscription required for full details' });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Increment view count
    user.ideasViewedToday += 1;
    await user.save();

    res.json({ idea });
  } catch (error) {
    console.error('Get idea details error:', error);
    res.status(500).json({ error: 'Failed to fetch idea details' });
  }
};

exports.getIdeaOfTheDay = async (req, res) => {
  try {
    const idea = await Idea.findOne({ isIdeaOfTheDay: true })
      .select('ideaTitle problemDetected createdAt');

    if (!idea) {
      return res.status(404).json({ error: 'No idea of the day available' });
    }

    res.json({ idea });
  } catch (error) {
    console.error('Get idea of the day error:', error);
    res.status(500).json({ error: 'Failed to fetch idea of the day' });
  }
};
