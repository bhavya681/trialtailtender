import Message from '../models/Message.js';

// Fetch chat history
export const getChatHistory = async (req, res) => {
    try {
      const chatRoomId = req.params.chatRoomId;
      const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 });
  
      if (!messages) {
        return res.status(404).json({ success: false, message: 'No messages found.' });
      }
  
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Unable to fetch chat history' });
    }
  };
  
  

// Send a message
export const sendMessage = async (req, res) => {
    const { chatRoomId, user, receiverId, message } = req.body;
  
    if (!chatRoomId || !user || !receiverId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const newMessage = new Message({ chatRoomId, user, receiverId, message });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send message' });
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
      { new: true } // Return the updated message
    );
    if (!updatedMessage) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update message' });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete message' });
  }
};

// Identify message owner
export const getMessageOwner = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    const isCurrentUserMessage = req.query.userId === message.senderId;
    res.status(200).json({ isCurrentUserMessage });
  } catch (error) {
    res.status(500).json({ error: 'Unable to determine message ownership' });
  }
};
