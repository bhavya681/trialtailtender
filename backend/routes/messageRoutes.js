import express from "express";
import {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  createCommunityMessage,
  getCommunityMessages,
  updateCommunityMessage,
  deleteCommunityMessage,
} from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new message
router.post("/", createMessage);

// Get messages between two users
router.get("/:user1Id/:user2Id", getMessages);

// Update a message
router.put("/:messageId", updateMessage);

// Delete a message
router.delete("/:messageId", deleteMessage);

// Community chat routes
router.post('/community-chat',protect, createCommunityMessage);

// Get all messages for a community room
router.get('/community-chat/:roomId',protect, getCommunityMessages);

// Update a community message
router.put('/community-chat/:messageId',protect, updateCommunityMessage);

// Delete a community message 
router.delete('/community-chat/:messageId/:roomId',protect, deleteCommunityMessage);

export default router;
