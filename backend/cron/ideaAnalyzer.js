const cron = require('node-cron');
const Idea = require('../models/Idea');

const setupCronJobs = () => {
  // Run every day at midnight to set new Idea of the Day
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running Idea of the Day cron job...');

      // Remove previous Idea of the Day
      await Idea.updateMany(
        { isIdeaOfTheDay: true },
        { 
          isIdeaOfTheDay: false,
          ideaOfTheDayDate: null
        }
      );

      // Get all ideas that haven't been Idea of the Day recently
      const ideas = await Idea.find({
        $or: [
          { ideaOfTheDayDate: null },
          { ideaOfTheDayDate: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        ]
      });

      if (ideas.length > 0) {
        // Select random idea
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
        
        randomIdea.isIdeaOfTheDay = true;
        randomIdea.ideaOfTheDayDate = new Date();
        await randomIdea.save();

        console.log(`New Idea of the Day: ${randomIdea.ideaTitle}`);
      } else {
        console.log('No ideas available for Idea of the Day');
      }
    } catch (error) {
      console.error('Idea of the Day cron error:', error);
    }
  });

  console.log('Cron jobs initialized');
};

module.exports = setupCronJobs;
