const express = require('express');
const router = express.Router();
const chatController = require('./controller/controllers');

router.post('/api/rooms', chatController.createRoom);
router.get('/api/rooms', chatController.getRooms);
router.post('/api/messages', chatController.createMessage);
router.get('/api/messages', chatController.getMessages);

module.exports = router;
