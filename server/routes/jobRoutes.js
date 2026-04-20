const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, admin, provider } = require('../middleware/authMiddleware');
const { logAction } = require('../services/auditService');

// @desc    Get jobs posted by the logged-in provider
// @route   GET /api/jobs/provider
// @access  Private/Provider
router.get('/provider', protect, provider, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Provider Analytics
// @route   GET /api/jobs/provider/analytics
// @access  Private/Provider
router.get('/provider/analytics', protect, provider, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id });
        const jobIds = jobs.map(j => j._id);
        const Application = require('../models/Application');
        const applications = await Application.find({ job: { $in: jobIds } });

        const stats = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'active').length,
            totalApplications: applications.length,
            hiresSecured: applications.filter(a => a.status === 'Accepted').length,
            shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
            statusDistribution: {
                Pending: applications.filter(a => a.status === 'Pending').length,
                Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
                Accepted: applications.filter(a => a.status === 'Accepted').length,
                Rejected: applications.filter(a => a.status === 'Rejected').length,
            },
            topJobs: await Application.aggregate([
                { $match: { job: { $in: jobIds } } },
                { $group: { _id: "$job", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 3 },
                { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "jobDetails" } },
                { $unwind: "$jobDetails" },
                { $project: { title: "$jobDetails.title", count: 1 } }
            ])
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get AI match for a job (Cached or Newly Calculated)
// @route   GET /api/jobs/:id/match
// @access  Private
router.get('/:id/match', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const JobMatch = require('../models/JobMatch');
        const isRefresh = req.query.refresh === 'true';

        // 1. Check Cache if not refreshing
        if (!isRefresh) {
            const cachedMatch = await JobMatch.findOne({ userId: user._id, jobId: job._id });
            if (cachedMatch) return res.json(cachedMatch);
            return res.json({ notCalculated: true });
        }

        // 2. Compute Match
        const { matchJobToProfile, calculateLocalMatch } = require('../services/aiService');
        
        let calculated;
        
        if (user.resumeText) {
            calculated = await matchJobToProfile(user.resumeText, job.description);
        } else if (user.skills && user.skills.length > 0) {
            calculated = calculateLocalMatch(user.skills, job);
        } else {
             return res.status(400).json({ message: 'Profile incomplete or resume missing' });
        }

        // 3. Save to Cache
        const matchData = await JobMatch.findOneAndUpdate(
            { userId: user._id, jobId: job._id },
            {
                matchPercentage: calculated.matchPercentage,
                reason: calculated.reason,
                missingSkills: calculated.missingSkills
            },
            { upsert: true, new: true }
        );

        res.json(matchData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Admin or Provider
router.post('/', protect, provider, async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user.id
        });
        await logAction(req.user.id, 'Job Created', 'Job', job._id, `Title: ${job.title}`, req);

        // Notify all job seekers about the new job
        const { bulkCreateNotifications } = require('../services/notificationService');
        const seekers = await User.find({ role: 'job_seeker' }).select('_id');
        
        if (seekers.length > 0) {
            const notifications = seekers.map(seeker => ({
                userId: seeker._id,
                type: 'new_job',
                title: '🆕 New Job Posted',
                body: `A new job "${job.title}" matching your profile might be available!`,
                link: '/jobs',
                meta: { jobId: job._id }
            }));
            await bulkCreateNotifications(notifications);

            // Emit to each connected seeker via Socket.IO
            const io = req.app.get('io');
            if (io) {
                seekers.forEach(seeker => {
                    io.to(`user_${seeker._id}`).emit('new_notification');
                });
            }
        }

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Admin or Provider (Ownership)
router.put('/:id', protect, provider, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership: Admin can update any, Provider only their own
        if (req.user.role !== 'admin' && job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this job' });
        }
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        await logAction(req.user.id, 'Job Updated', 'Job', updatedJob._id, `Title: ${updatedJob.title}`, req);
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin or Provider (Ownership)
router.delete('/:id', protect, provider, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (req.user.role !== 'admin' && job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this job' });
        }
        await job.deleteOne();
        await logAction(req.user.id, 'Job Deleted', 'Job', job._id, `Title: ${job.title}`, req);
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle Job Status (Active/Closed)
// @route   PATCH /api/jobs/:id/status
// @access  Private/Provider
router.patch('/:id/status', protect, provider, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        job.status = job.status === 'active' ? 'closed' : 'active';
        await job.save();
        
        await logAction(req.user.id, 'Job Status Toggled', 'Job', job._id, `New Status: ${job.status}`, req);
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get AI Job Recommendations
// @route   POST /api/jobs/recommend
// @access  Private (Needs User Profile/Resume)
router.post('/recommend', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // 1. Fetch all active jobs - no strict skill filtering so discovery always shows results
        const userSkills = user.skills || [];
        const targetJobs = await Job.find({ status: 'active' }).limit(15).sort({ createdAt: -1 });

        // 2. Score each job using AI Matching (Falling back to local if quota exceeded)
        const { calculateLocalMatch, matchJobToProfile } = require('../services/aiService');
        const JobMatch = require('../models/JobMatch');

        const recommendations = await Promise.all(targetJobs.map(async (job) => {
            const isRefresh = req.body.refresh === true;

            // Check cache first (unless refreshing)
            let matchData = isRefresh ? null : await JobMatch.findOne({ userId: user._id, jobId: job._id });

            // If refreshing, not in cache, or it contains an error message, update/create it
            if (!matchData || matchData.reason === "Error in AI processing") {
                let aiMatchResult;
                
                const profileContext = user.resumeText || `Skills: ${user.skills?.join(', ')}. Experience: ${JSON.stringify(user.experience || [])}. Education: ${JSON.stringify(user.education || [])}`;
                
                try {
                    aiMatchResult = await matchJobToProfile(profileContext, job.description || job.title);
                } catch (err) {
                    console.error("AI Match failed for job:", job.title, err);
                    aiMatchResult = calculateLocalMatch(user.skills, job);
                }

                matchData = await JobMatch.findOneAndUpdate(
                    { userId: user._id, jobId: job._id },
                    {
                        matchPercentage: aiMatchResult.matchPercentage,
                        reason: aiMatchResult.reason,
                        missingSkills: aiMatchResult.missingSkills
                    },
                    { upsert: true, new: true }
                );
            }

            // Apply a minimum floor so every job appears in the feed
            const displayPercentage = Math.max(matchData.matchPercentage, userSkills.length > 0 ? 5 : 10);

            return {
                _id: job._id,
                job,
                matchPercentage: displayPercentage,
                reason: matchData.reason,
                missingSkills: matchData.missingSkills
            };
        }));

        // 3. Sort by match percentage
        recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
