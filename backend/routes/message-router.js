// backend/routes/message-router.js
const express = require('express');
const MessageCtrl = require('../controllers/message-ctrl');
const router = express.Router();

router.post('/api/messages', MessageCtrl.createMessage);
router.get('/api/messages/:id', MessageCtrl.getMessage);
router.get('/api/messages', MessageCtrl.getAllMessages); // Add this route to fetch all messages
router.get('api/messages/deleted-messages', MessageCtrl.deleteOldMessages);
router.delete('/:id', MessageCtrl.deleteMessageById);
router.put('/api/messages/:id', MessageCtrl.updateMessageById);
router.post('/api/messages/:id/like', MessageCtrl.likeMessage);
router.post('/api/messages/:id/unlike', MessageCtrl.unlikeMessage);


module.exports = router;
