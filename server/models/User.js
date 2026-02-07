const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'job_seeker', 'job_provider'],
        default: 'user'
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: [Object],
        default: []
    },
    resumeText: String, // Store parsed text for AI matching
    resumeOriginalName: String,
    resumePath: String,
    location: String,
    phone: String,
    bio: String,
    profilePicture: String,
    isProfileComplete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
