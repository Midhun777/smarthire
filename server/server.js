const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO setup with CORS
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Make io available to routes
app.set('io', io);

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('AI Job Recommendation API is running...');
});

// ─────────────────────────────────────────────
// Socket.IO — Real-time Chat
// ─────────────────────────────────────────────
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// Map userId → socket.id for targeted delivery
const userSockets = new Map();

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSockets.set(userId, socket.id);
        socket.join(`user_${userId}`); // Join personal notification room
        console.log(`[Socket.IO] User connected: ${userId} → ${socket.id}`);
    }

    // Join a conversation room
    socket.on('join_room', (conversationId) => {
        socket.join(conversationId);
        console.log(`[Socket.IO] ${userId} joined room: ${conversationId}`);
    });

    // Leave a room
    socket.on('leave_room', (conversationId) => {
        socket.leave(conversationId);
    });

    // Handle a new message
    socket.on('send_message', async ({ conversationId, senderId, content }) => {
        try {
            if (!conversationId || !senderId || !content?.trim()) return;

            // Verify sender is a participant
            const conv = await Conversation.findById(conversationId);
            if (!conv) return;

            const isProvider = conv.providerId.toString() === senderId;
            const isSeeker = conv.seekerId.toString() === senderId;
            if (!isProvider && !isSeeker) return;

            // Persist message
            const message = await Message.create({ conversationId, senderId, content: content.trim() });

            // Populate sender info for broadcast
            await message.populate('senderId', 'name profilePicture role');

            // Update conversation metadata + increment unread for the OTHER party
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: content.trim().substring(0, 100),
                lastMessageAt: new Date(),
                ...(isProvider ? { seekerUnread: conv.seekerUnread + 1 } : { providerUnread: conv.providerUnread + 1 })
            });

            // Broadcast to everyone in the room
            io.to(conversationId).emit('new_message', message);

            // Also notify the other party's personal socket if not in this room
            const otherUserId = isProvider ? conv.seekerId.toString() : conv.providerId.toString();
            const otherSocketId = userSockets.get(otherUserId);
            if (otherSocketId) {
                io.to(otherSocketId).emit('unread_update', { conversationId });
            }

            console.log(`[Socket.IO] Message saved in ${conversationId} from ${senderId}`);
        } catch (err) {
            console.error('[Socket.IO] send_message error:', err);
            socket.emit('message_error', { error: 'Failed to send message' });
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        if (userId) {
            userSockets.delete(userId);
            console.log(`[Socket.IO] User disconnected: ${userId}`);
        }
    });
});

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smarthire');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

mongoose.connection.on('error', err => {
    console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Start Server
const startServer = async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Socket.IO enabled)`);
    });
};

startServer();
