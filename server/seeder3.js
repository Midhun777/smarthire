const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const seedData = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smarthire');
        console.log('MongoDB Connected!');

        console.log('Deleting existing data...');
        // We do it this way to see if it works!
        
        console.log('Creating Admin...');
        const adminUser = await User.findOne({ email: 'admin@example.com' }) || await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        });

        console.log('Creating Providers...');
        const providers = await User.find({ role: 'job_provider' });

        console.log('Providers length:', providers.length);

        console.log('Creating Seekers...');
        const seekers = await User.find({ role: 'job_seeker' });

        console.log('Creating Jobs sequentially...');
        const seedJobs = require('./data/jobs');
        const jobs = [];
        for (let i = 0; i < seedJobs.length; i++) {
            const jobData = seedJobs[i];
            const randomProvider = providers[Math.floor(Math.random() * providers.length)];
            console.log(`Creating job ${i + 1}/${seedJobs.length}: ${jobData.title}`);
            const job = await Job.create({ ...jobData, postedBy: randomProvider._id });
            jobs.push(job);
        }

        console.log('Creating Applications...');
        const applications = await Application.create([
            { job: jobs[0]._id, user: seekers[0]._id, status: 'Shortlisted', appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { job: jobs[1]._id, user: seekers[3]._id, status: 'Pending', appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { job: jobs[2]._id, user: seekers[1]._id, status: 'Reviewed', appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { job: jobs[3]._id, user: seekers[4]._id, status: 'Accepted', appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { job: jobs[4]._id, user: seekers[2]._id, status: 'Rejected', appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
            { job: jobs[0]._id, user: seekers[4]._id, status: 'Pending', appliedAt: new Date() },
            { job: jobs[1]._id, user: seekers[0]._id, status: 'Pending', appliedAt: new Date() }
        ]);

        console.log('Data Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
