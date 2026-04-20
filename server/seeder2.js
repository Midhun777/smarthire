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
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        console.log('Creating Admin...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        });

        console.log('Creating Providers...');
        const providers = await User.create([
            { name: 'Kochi Infopark Solutions', email: 'info@infopark.com', password: 'password123', role: 'job_provider' },
            { name: 'Malabar Tech Park', email: 'hr@malabartech.com', password: 'password123', role: 'job_provider' },
            { name: 'Trivandrum Technopark Hub', email: 'contact@technopark.com', password: 'password123', role: 'job_provider' }
        ]);

        console.log('Creating Seekers...');
        const seekers = await User.create([
            { name: 'Rahul Nair', email: 'rahul@example.com', password: 'password123', role: 'job_seeker', skills: ['React', 'Node.js', 'Tailwind CSS'] },
            { name: 'Anjali Menon', email: 'anjali@example.com', password: 'password123', role: 'job_seeker', skills: ['Python', 'Data Science', 'Machine Learning'] },
            { name: 'Sreejith Panicker', email: 'sreejith@example.com', password: 'password123', role: 'job_seeker', skills: ['Java', 'Spring Boot', 'SQL'] },
            { name: 'Meera Pillai', email: 'meera@example.com', password: 'password123', role: 'job_seeker', skills: ['Figma', 'UI/UX Design', 'CSS'] },
            { name: 'Faizal Khan', email: 'faizal@example.com', password: 'password123', role: 'job_seeker', skills: ['Flutter', 'Dart', 'Firebase'] }
        ]);

        console.log('Creating Jobs...');
        const seedJobs = require('./data/jobs');
        const jobs = await Promise.all(seedJobs.map(async (job) => {
            const randomProvider = providers[Math.floor(Math.random() * providers.length)];
            return await Job.create({ ...job, postedBy: randomProvider._id });
        }));

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
