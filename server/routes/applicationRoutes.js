const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect, admin, provider } = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const { logAction } = require('../services/auditService');
const { createNotification } = require('../services/notificationService');

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
        const myJobs = await Job.find({ postedBy: req.user.id });
        const jobIds = myJobs.map(job => job._id);

        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title company description requirements shortlistCriteria')
            .populate('user', 'name email skills education experience resumeText')
            .sort({ createdAt: -1 });

        const { matchJobToProfile } = require('../services/aiService');

        const appsWithScores = await Promise.all(applications.map(async (app) => {
            const appObj = app.toObject();
            
            // AI Matching (Persisted)
            // If match is missing or too old, try to calculate it (but don't block everything)
            if (!app.aiMatch?.calculatedAt && app.user?.resumeText && app.job?.description) {
                try {
                    const matchData = await matchJobToProfile(app.user.resumeText, app.job.description);
                    app.aiMatch = { ...matchData, calculatedAt: new Date() };
                    await app.save(); // Persist for next time
                    appObj.aiMatch = app.aiMatch;
                } catch (err) {
                    console.error(`[AI-Retry-Fail] app ${app._id}:`, err.message);
                    // Use transient failure object but don't save it as "final"
                    appObj.aiMatch = { matchPercentage: 0, reason: "AI currently unavailable - will retry soon" };
                }
            } else {
                // Use already calculated match
                appObj.aiMatch = app.aiMatch || { matchPercentage: 0, reason: "Insufficient data" };
            }

            // Metadata for Sorting (Calculated on the fly)
            const userSkills = (app.user?.skills || []).map(s => s.toLowerCase());
            const jobReqs = (app.job?.requirements || []).map(r => r.toLowerCase());
            appObj.skillMatchCount = jobReqs.filter(req => userSkills.some(s => s.includes(req) || req.includes(s))).length;

            const edu = app.user?.education || [];
            const degrees = edu.map(e => (e.degree || '').toLowerCase());
            let rank = 0; 
            if (degrees.some(d => d.includes('phd') || d.includes('doctor'))) rank = 5;
            else if (degrees.some(d => d.includes('master') || d.includes('m.tech') || d.includes('mca') || d.includes('mba'))) rank = 4;
            else if (degrees.some(d => d.includes('bachelor') || d.includes('b.tech') || d.includes('bca') || d.includes('bsc'))) rank = 3;
            else if (degrees.some(d => d.includes('diploma'))) rank = 2;
            else if (edu.length > 0) rank = 1;
            appObj.educationRank = rank;

            appObj.experienceCount = (app.user?.experience || []).length;

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

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const user = await require('../models/User').findById(req.user.id);

        let initialStatus = 'Pending';
        let aiMatchResult = null;

        // AI Match & Auto-Shortlisting Logic
        if (user.resumeText) {
            const { matchJobToProfile } = require('../services/aiService');
            try {
                const matchData = await matchJobToProfile(user.resumeText, job.description);
                aiMatchResult = { ...matchData, calculatedAt: new Date() };
                
                if (job.shortlistCriteria?.autoShortlist && 
                    matchData.matchPercentage >= (job.shortlistCriteria.minAiScore || 0)) {
                    initialStatus = 'Shortlisted';
                    console.log(`[Auto-Shortlist] User ${user.name} auto-shortlisted for job ${job.title} with score ${matchData.matchPercentage}%`);
                }
            } catch (err) {
                console.error('[AI-Match-Fail] During application submission:', err.message);
            }
        }

        const application = await Application.create({
            job: jobId,
            user: req.user.id,
            status: initialStatus,
            aiMatch: aiMatchResult
        });

        await logAction(req.user.id, 'Application Submitted', 'Application', application._id, `Job ID: ${jobId} | Initial Status: ${initialStatus}`, req);

        // Notify the Job Provider
        const { createNotification } = require('../services/notificationService');
        await createNotification({
            userId: job.postedBy,
            type: 'application_received',
            title: '📩 New Application Received',
            body: `${user.name} applied for "${job.title}".`,
            link: '/provider/dashboard',
            meta: { jobId: job._id, applicationId: application._id }
        });
        const io = req.app.get('io');
        if (io) io.to(`user_${job.postedBy}`).emit('new_notification');

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

        // ── Notification to the applicant ──────────────────
        const statusMessages = {
            Reviewed:    { title: '📋 Application Under Review', body: `Your application for "${application.job?.title}" is being reviewed.` },
            Shortlisted: { title: "⭐ You've Been Shortlisted!", body: `Great news! You've been shortlisted for "${application.job?.title}". The provider may contact you soon.` },
            Accepted:    { title: '🎉 Application Accepted!', body: `Congratulations! Your application for "${application.job?.title}" has been accepted.` },
            Rejected:    { title: '❌ Application Update', body: `Your application for "${application.job?.title}" was not selected this time. Keep going!` },
        };
        const notifData = statusMessages[application.status];
        if (notifData) {
            await createNotification({
                userId: application.user,
                type: 'status_change',
                title: notifData.title,
                body: notifData.body,
                link: '/applications',
                meta: { status: application.status, jobId: application.job?._id }
            });
            // Push via Socket.IO if user is online
            const io = req.app.get('io');
            if (io) io.to(`user_${application.user}`).emit('new_notification');
        }

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

// @desc    Update user's personal note on their own application
// @route   PATCH /api/applications/:id/note
// @access  Private
router.patch('/:id/note', protect, async (req, res) => {
    try {
        const application = await Application.findOne({ _id: req.params.id, user: req.user.id });
        if (!application) return res.status(404).json({ message: 'Application not found' });
        application.userNote = req.body.note ?? application.userNote;
        await application.save();
        res.json({ userNote: application.userNote });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

