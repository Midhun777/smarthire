const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default: []
    },
    salaryRange: {
        type: String
    },
    aiTags: {
        type: [String], // Keywords extracted by AI for matching
        default: []
    },
    experienceLevel: {
        type: String, // e.g. "Entry Level", "Senior"
        required: true
    },
    type: {
        type: String, // Full-time, Remote, etc.
        default: 'Full-time'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
