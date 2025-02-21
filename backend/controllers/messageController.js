import Message from "../models/Message.js";

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const {  message } = req.body;
const {senderId, receiverId}=req.params;
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { message },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Community Chat APIs

// Create a new community message
export const createCommunityMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { userId } = req.user; // Assuming user info is attached via auth middleware
    const newMessage = new Message({
      senderId: userId,
      receiverId: 'community',
      message,
      type: 'community',
      isPublic: true // Add isPublic flag to indicate message is for all
    });
    
    const savedMessage = await newMessage.save();
    
    // Emit socket event to broadcast message to all users in community
    req.io.to('community').emit('message', savedMessage);

    res.status(201).json({
      success: true,
      newMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for a community room
export const getCommunityMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      receiverId: 'community',
      type: 'community'
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a community message
export const updateCommunityMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const { userId } = req.user;

    const updatedMessage = await Message.findOneAndUpdate(
      {
        _id: messageId,
        senderId: userId, // Use senderId instead of userId
        type: 'community'
      },
      { message },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found or unauthorized" });
    }

    res.json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a community message
export const deleteCommunityMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.user;

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      senderId: userId, // Use senderId instead of userId
      receiverId: 'community',
      type: 'community'
    });

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found or unauthorized" });
    }

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};