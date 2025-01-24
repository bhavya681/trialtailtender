import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import http from 'http';
import {Server} from 'socket.io';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
const _dirname=path.resolve();
app.use(cors());
app.use(express.json());
// Create HTTP server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// WebSocket for real-time messaging
io.on("connection", (socket) => {
  // console.log("A user connected");

  // Join chat room
  socket.on("joinRoom", (chatRoomId) => {
    socket.join(chatRoomId);
    // console.log(`User joined room: ${chatRoomId}`);
  });

  // Handle new messages
  socket.on("sendMessage", async (data) => {
    const { chatRoomId, senderId, receiverId, message } = data;
    const newMessage = new Message({ chatRoomId, senderId, receiverId, message });

    await newMessage.save();
    io.to(chatRoomId).emit("receiveMessage", newMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use('/api/messages',messageRoutes)
// Routes
app.get('/api/test', (req, res) => {
  res.send('API is working');
});
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/sitters', sitterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chatbot', chatRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"/frontend","dist","index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
