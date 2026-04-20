const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    providerUnread: {
        type: Number,
        default: 0
    },
    seekerUnread: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Each provider-seeker-job combination is unique
conversationSchema.index({ jobId: 1, providerId: 1, seekerId: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
