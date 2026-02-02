const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logAction } = require('../services/auditService');
const router = express.Router();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Store password as plain text (USER REQUESTED)
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            await logAction(user._id, 'User Registered', 'User', user._id, `Role: ${user.role}`, req);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Compare plain text password (USER REQUESTED)
        if (user && user.password === password) {
            await logAction(user._id, 'User Login', 'User', user._id, `Login successful`, req);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id, user.role),
            });
        } else {
            // Log failed login if user exists
            const failedUser = await User.findOne({ email });
            if (failedUser) {
                await logAction(failedUser._id, 'Login Failed', 'User', failedUser._id, `Failed attempt for email: ${email}`, req);
            }
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
