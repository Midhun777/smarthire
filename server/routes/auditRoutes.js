const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @desc    Get all audit logs
 * @route   GET /api/audit
 * @access  Private/Admin
 */
router.get('/', protect, admin, async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('user', 'name email')
            .sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
});

module.exports = router;
