const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, admin, provider } = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const { logAction } = require('../services/auditService');

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('job', 'title company')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get applications for a specific user (Job Seeker)
// @route   GET /api/applications/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id })
            .populate('job', 'title company location')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get applications for jobs posted by the provider
// @route   GET /api/applications/provider
// @access  Private/Provider
router.get('/provider', protect, provider, async (req, res) => {
    try {
        // Find jobs posted by this provider
        const myJobs = await Job.find({ postedBy: req.user.id });
        const jobIds = myJobs.map(job => job._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title company description')
            .populate('user', 'name email skills resumeText')
            .sort({ createdAt: -1 });

        // Calculate AI match scores for each application if resumeText and job description exist
        const { matchJobToProfile } = require('../services/aiService');

        const appsWithScores = await Promise.all(applications.map(async (app) => {
            const appObj = app.toObject();
            if (app.user?.resumeText && app.job?.description) {
                try {
                    const matchData = await matchJobToProfile(app.user.resumeText, app.job.description);
                    appObj.aiMatch = matchData;
                } catch (err) {
                    console.log(`Match failed for app ${app._id}`, err.message);
                    appObj.aiMatch = { matchPercentage: 0, reason: "AI match failed" };
                }
            } else {
                appObj.aiMatch = { matchPercentage: 0, reason: "Insufficient data for AI match" };
            }
            return appObj;
        }));

        res.json(appsWithScores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create an application
// @route   POST /api/applications
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { jobId } = req.body;

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: jobId,
            user: req.user.id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: jobId,
            user: req.user.id
        });

        await logAction(req.user.id, 'Application Submitted', 'Application', application._id, `Job ID: ${jobId}`, req);

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update application status (Admin or Job Provider)
// @route   PUT /api/applications/:id
// @access  Private/Admin or Provider
router.put('/:id', protect, provider, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership: Admin can update any, Provider only if it's their job
        if (req.user.role !== 'admin' && application.job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        application.status = status || application.status;
        const updatedApplication = await application.save();
        await logAction(req.user.id, 'Application Status Updated', 'Application', application._id, `New Status: ${application.status}`, req);
        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get admin dashboard stats
// @route   GET /api/applications/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const [userCount, jobCount, appCount, recentApps] = await Promise.all([
            require('../models/User').countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
            Application.find().populate('job', 'title').populate('user', 'name').sort({ createdAt: -1 }).limit(5)
        ]);

        // Weekly chart data (dummy logic for stats)
        const chartData = [
            { name: 'Mon', apps: 4 },
            { name: 'Tue', apps: 7 },
            { name: 'Wed', apps: 5 },
            { name: 'Thu', apps: 10 },
            { name: 'Fri', apps: 8 },
            { name: 'Sat', apps: 3 },
            { name: 'Sun', apps: appCount }
        ];

        res.json({
            users: userCount,
            jobs: jobCount,
            applications: appCount,
            recentApps,
            chartData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
