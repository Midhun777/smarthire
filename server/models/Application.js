const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    aiMatch: {
        matchPercentage: { type: Number, default: 0 },
        reason: { type: String, default: '' },
        calculatedAt: { type: Date }
    },
    userNote: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
