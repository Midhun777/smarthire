const express = require('express');
const router = express.Router();
const SystemSettings = require('../models/SystemSettings');
const Application = require('../models/Application');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
router.get('/settings', protect, admin, async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get public system settings (Maintenance, Alerts)
// @route   GET /api/admin/public-settings
// @access  Public
router.get('/public-settings', async (req, res) => {
    try {
        const settings = await SystemSettings.findOne().select('maintenanceMode systemAlert supportEmail');
        res.json(settings || { maintenanceMode: false, systemAlert: '', supportEmail: 'support@smarthire.com' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
router.put('/settings', protect, admin, async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
router.get('/applications', protect, admin, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('user', 'name email')
            .populate('job', 'title company location')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle user verification
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
router.put('/users/:id/verify', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isVerified = !user.isVerified;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
