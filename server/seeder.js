const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/job-ai')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        // 1. Create Admin
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        });

        // 2. Create Job Providers (Employers from Kerala)
        const providers = await User.create([
            {
                name: 'Kochi Infopark Solutions',
                email: 'info@infopark.com',
                password: 'password123',
                role: 'job_provider'
            },
            {
                name: 'Malabar Tech Park',
                email: 'hr@malabartech.com',
                password: 'password123',
                role: 'job_provider'
            },
            {
                name: 'Trivandrum Technopark Hub',
                email: 'contact@technopark.com',
                password: 'password123',
                role: 'job_provider'
            }
        ]);

        // 3. Create Job Seekers (Kerala Names)
        const seekers = await User.create([
            {
                name: 'Rahul Nair',
                email: 'rahul@example.com',
                password: 'password123',
                role: 'job_seeker',
                skills: ['React', 'Node.js', 'Tailwind CSS'],
            },
            {
                name: 'Anjali Menon',
                email: 'anjali@example.com',
                password: 'password123',
                role: 'job_seeker',
                skills: ['Python', 'Data Science', 'Machine Learning'],
            },
            {
                name: 'Sreejith Panicker',
                email: 'sreejith@example.com',
                password: 'password123',
                role: 'job_seeker',
                skills: ['Java', 'Spring Boot', 'SQL'],
            },
            {
                name: 'Meera Pillai',
                email: 'meera@example.com',
                password: 'password123',
                role: 'job_seeker',
                skills: ['Figma', 'UI/UX Design', 'CSS'],
            },
            {
                name: 'Faizal Khan',
                email: 'faizal@example.com',
                password: 'password123',
                role: 'job_seeker',
                skills: ['Flutter', 'Dart', 'Firebase'],
            }
        ]);

        // 4. Create Jobs
        const seedJobs = require('./data/jobs');

        // 4. Create Jobs from Rich Data
        const jobs = await Promise.all(seedJobs.map(async (job) => {
            const randomProvider = providers[Math.floor(Math.random() * providers.length)];
            return await Job.create({
                ...job,
                postedBy: randomProvider._id
            });
        }));

        // 5. Create Applications
        const applications = await Application.create([
            { job: jobs[0]._id, user: seekers[0]._id, status: 'Shortlisted', appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { job: jobs[1]._id, user: seekers[3]._id, status: 'Pending', appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { job: jobs[2]._id, user: seekers[1]._id, status: 'Reviewed', appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { job: jobs[3]._id, user: seekers[4]._id, status: 'Accepted', appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { job: jobs[4]._id, user: seekers[2]._id, status: 'Rejected', appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
            { job: jobs[0]._id, user: seekers[4]._id, status: 'Pending', appliedAt: new Date() },
            { job: jobs[1]._id, user: seekers[0]._id, status: 'Pending', appliedAt: new Date() }
        ]);

        console.log('Kerala-themed Data Seeded Successfully!');
        console.log(`- 1 Admin\n- ${providers.length} Job Providers\n- ${seekers.length} Job Seekers\n- ${jobs.length} Jobs\n- ${applications.length} Applications`);
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
