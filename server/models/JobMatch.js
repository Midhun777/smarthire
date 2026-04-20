const mongoose = require('mongoose');

const jobMatchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    matchPercentage: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    missingSkills: {
        type: [String],
        default: []
    },
    resumeHash: {
        type: String // To detect if matched against a different resume version
    }
}, { timestamps: true });

// Ensure unique match per user-job pair
jobMatchSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('JobMatch', jobMatchSchema);
