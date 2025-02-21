import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import sitterRoutes from "./routes/sitterRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import favRoutes from "./routes/favRoutes.js";
import Message from "./models/Message.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import communityChatRoutes from "./routes/communityChatRoutes.js";
dotenv.config();
connectDB();

const app = express();
const _dirname = path.resolve();
app.use(cors({origin:process.env.CLIENT_URL}));
app.use(express.json());

// Create HTTP Server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

// WebSocket for Real-Time Messaging
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join chat room based on user IDs
  socket.on("joinChat", ({ senderId, receiverId }) => {
    const chatRoom = [senderId, receiverId].sort().join("_");
    socket.join(chatRoom);
    console.log(`User joined chat: ${chatRoom}`);
  });


  // Sending messages
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message } = data;
    const newMessage = new Message({ senderId, receiverId, message });

    await newMessage.save();

    const chatRoom = [senderId, receiverId].sort().join("_");
    io.to(chatRoom).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/sitters", sitterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chatbot", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/community-chat", communityChatRoutes);
app.use("/api/favourites", favRoutes);
app.use(express.static(path.join(_dirname, "/frontend/dist")));
// app.get("*", (_, res) => {
//   res.sendFile(path.resolve(_dirname, "/frontend", "dist", "index.html"));
// });

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
