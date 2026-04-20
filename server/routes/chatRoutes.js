const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, provider } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
// @desc    Provider starts or retrieves a conversation with a shortlisted applicant
// @route   POST /api/chat/conversations
// @access  Private/Provider
// ─────────────────────────────────────────────
router.post('/conversations', protect, provider, async (req, res) => {
    try {
        const { jobId, seekerId } = req.body;

        // 1. Verify job belongs to provider
        const job = await Job.findOne({ _id: jobId, postedBy: req.user.id });
        if (!job) {
            return res.status(403).json({ message: 'You do not own this job posting' });
        }

        // 2. Verify the seeker is Shortlisted for this job
        const application = await Application.findOne({
            job: jobId,
            user: seekerId,
            status: 'Shortlisted'
        });
        if (!application) {
            return res.status(403).json({
                message: 'Chat is only available for Shortlisted candidates'
            });
        }

        // 3. Find or create conversation (upsert)
        const conversation = await Conversation.findOneAndUpdate(
            { jobId, providerId: req.user.id, seekerId },
            { jobId, providerId: req.user.id, seekerId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
            .populate('jobId', 'title company')
            .populate('providerId', 'name email profilePicture')
            .populate('seekerId', 'name email profilePicture');

        res.status(200).json(conversation);
    } catch (error) {
        console.error('[Chat] Start conversation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// @desc    Get all conversations for the current user (inbox)
// @route   GET /api/chat/conversations
// @access  Private
// ─────────────────────────────────────────────
router.get('/conversations', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const isProvider = req.user.role === 'job_provider';

        const query = isProvider
            ? { providerId: userId }
            : { seekerId: userId };

        const conversations = await Conversation.find(query)
            .populate('jobId', 'title company')
            .populate('providerId', 'name email profilePicture')
            .populate('seekerId', 'name email profilePicture')
            .sort({ lastMessageAt: -1 });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// @desc    Get messages for a conversation (paginated)
// @route   GET /api/chat/conversations/:id/messages
// @access  Private (participants only)
// ─────────────────────────────────────────────
router.get('/conversations/:id/messages', protect, async (req, res) => {
    try {
        const conv = await Conversation.findById(req.params.id);
        if (!conv) return res.status(404).json({ message: 'Conversation not found' });

        const userId = req.user.id;
        const isParticipant =
            conv.providerId.toString() === userId ||
            conv.seekerId.toString() === userId;

        if (!isParticipant) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ conversationId: req.params.id })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .populate('senderId', 'name profilePicture role');

        // Auto-mark as read
        const isProvider = conv.providerId.toString() === userId;
        if (isProvider && conv.providerUnread > 0) {
            await Conversation.findByIdAndUpdate(req.params.id, { providerUnread: 0 });
        } else if (!isProvider && conv.seekerUnread > 0) {
            await Conversation.findByIdAndUpdate(req.params.id, { seekerUnread: 0 });
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// @desc    Get total unread count for Navbar badge
// @route   GET /api/chat/unread
// @access  Private
// ─────────────────────────────────────────────
router.get('/unread', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const isProvider = req.user.role === 'job_provider';

        const conversations = await Conversation.find(
            isProvider ? { providerId: userId } : { seekerId: userId }
        );

        const totalUnread = conversations.reduce((sum, c) => {
            return sum + (isProvider ? c.providerUnread : c.seekerUnread);
        }, 0);

        res.json({ unread: totalUnread });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────
// @desc    Mark all messages as read in a conversation
// @route   POST /api/chat/conversations/:id/read
// @access  Private
// ─────────────────────────────────────────────
router.post('/conversations/:id/read', protect, async (req, res) => {
    try {
        const conv = await Conversation.findById(req.params.id);
        if (!conv) return res.status(404).json({ message: 'Not found' });

        const userId = req.user.id;
        const isProvider = conv.providerId.toString() === userId;

        if (isProvider) {
            conv.providerUnread = 0;
        } else if (conv.seekerId.toString() === userId) {
            conv.seekerUnread = 0;
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        await conv.save();
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
