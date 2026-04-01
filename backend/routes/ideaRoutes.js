const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { auth, isInnovator } = require('../middleware/auth');

router.get('/ideas', auth, isInnovator, ideaController.getIdeas);
router.get('/ideas/today', auth, isInnovator, ideaController.getIdeaOfTheDay);
router.get('/ideas/:ideaId', auth, isInnovator, ideaController.getIdeaDetails);

module.exports = router;
