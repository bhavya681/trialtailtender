import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatRoomId: String,
  user: { type: String, required: true },
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;