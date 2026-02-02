const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const { extractSkillsFromResume } = require('../services/aiService');
const { logAction } = require('../services/auditService');

// Multer Setup
const upload = multer({ dest: 'uploads/' });

// @desc    Upload Resume & Parse
// @route   POST /api/users/resume
// @access  Private
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const userId = req.user.id;
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;

        // Extract using AI
        const aiData = await extractSkillsFromResume(filePath, mimeType);

        // Update User Profile
        const user = await User.findById(userId);
        if (user) {
            user.resumePath = filePath;
            user.resumeOriginalName = req.file.originalname;
            user.resumeText = aiData.rawText; // Save raw text
            user.skills = aiData.skills || [];
            user.experience = aiData.experience || [];
            await user.save();

            await logAction(userId, 'Resume Uploaded', 'User', userId, `File: ${req.file.originalname}`, req);

            res.json({
                message: 'Resume parsed and profile updated',
                skills: user.skills,
                experience: user.experience
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get User Profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await user.deleteOne();
            await logAction(req.user.id, 'User Deleted', 'User', user._id, `Email: ${user.email}`, req);
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            await logAction(req.user.id, 'User Role Updated', 'User', user._id, `New Role: ${updatedUser.role}`, req);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark profile as complete
// @route   PUT /api/users/profile/complete
// @access  Private
router.put('/profile/complete', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.isProfileComplete = true;
            await user.save();
            res.json({ message: 'Profile marked as complete', isProfileComplete: true });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
