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

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
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

// @desc    Get AI match for a job
// @route   GET /api/jobs/:id/match
// @access  Private
router.get('/:id/match', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (!user || !user.resumeText) return res.status(400).json({ message: 'Resume not found' });

        const { matchJobToProfile } = require('../services/aiService');
        const matchData = await matchJobToProfile(user.resumeText, job.description);

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

// @desc    Get AI Job Recommendations
// @route   POST /api/jobs/recommend
// @access  Private (Needs User Profile/Resume)
router.post('/recommend', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.resumeText) {
            return res.status(400).json({ message: 'User profile or resume missing' });
        }

        // 1. Filter jobs by basic skill match (mongo queries) to reduce AI cost
        // Find jobs that have at least one skill in common with user
        const jobs = await Job.find({
            // Simple match: Job requirements overlap with User skills? 
            // For now, let's just get the latest 10 jobs to score
        }).limit(5).sort({ createdAt: -1 });

        // 2. Score each job using AI
        const { matchJobToProfile } = require('../services/aiService');

        const recommendations = await Promise.all(jobs.map(async (job) => {
            const matchData = await matchJobToProfile(user.resumeText, job.description);
            return {
                job,
                matchPercentage: matchData.matchPercentage,
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
