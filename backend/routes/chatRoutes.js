const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

router.get('/chats', auth, chatController.getChats);
router.post('/chats', auth, chatController.createChat);
router.get('/chats/:chatId/messages', auth, chatController.getMessages);
router.get('/users', auth, chatController.getUsers);

module.exports = router;
