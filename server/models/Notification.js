const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['status_change', 'new_job', 'new_message', 'application_received'],
        required: true
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: { type: String, default: '/' },
    isRead: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} } // extra data (jobId, status, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
