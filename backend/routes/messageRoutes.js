import express from 'express';
import {
  getChatHistory,
  sendMessage,
  updateMessage,
  deleteMessage,
  getMessageOwner,
} from '../controllers/messageController.js';

const router = express.Router();

// Chat history endpoint
router.get('/:chatRoomId', getChatHistory);

// Send a message
router.post('/', sendMessage);

// Update a message
router.put('/:messageId', updateMessage);

// Delete a message
router.delete('/:messageId', deleteMessage);

// Identify message owner
router.get('/owner/:messageId', getMessageOwner);

export default router;
