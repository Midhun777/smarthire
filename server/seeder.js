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
        const jobs = await Job.create([
            {
                title: 'Senior MERN Developer',
                company: 'Kochi Infopark Solutions',
                location: 'Kochi, Kerala',
                description: 'We need an experienced MERN developer to lead our new project in Kochi Infopark.',
                requirements: ['React', 'Node.js', 'MongoDB', 'Express'],
                experienceLevel: 'Senior',
                type: 'Full-time',
                salaryRange: '₹80,000 - ₹1,20,000',
                postedBy: providers[0]._id
            },
            {
                title: 'Junior UI Designer',
                company: 'Trivandrum Technopark Hub',
                location: 'Trivandrum, Kerala',
                description: 'Great opportunity for freshers to start their UI/UX career in the heart of Technopark.',
                requirements: ['Figma', 'Adobe XD', 'Creative Thinking'],
                experienceLevel: 'Entry Level',
                type: 'Remote',
                salaryRange: '₹25,000 - ₹40,000',
                postedBy: providers[2]._id
            },
            {
                title: 'Python Data Analyst',
                company: 'Malabar Tech Park',
                location: 'Calicut, Kerala',
                description: 'Join our data science team in Calicut and work on exciting AI projects.',
                requirements: ['Python', 'Pandas', 'Matplotlib', 'SQL'],
                experienceLevel: 'Mid Level',
                type: 'Full-time',
                salaryRange: '₹50,000 - ₹75,000',
                postedBy: providers[1]._id
            },
            {
                title: 'Flutter Mobile App Developer',
                company: 'Kochi Infopark Solutions',
                location: 'Remote (Kochi)',
                description: 'Looking for a Flutter developer to build high-quality mobile applications.',
                requirements: ['Flutter', 'Dart', 'API Integration'],
                experienceLevel: 'Mid Level',
                type: 'Full-time',
                salaryRange: '₹45,000 - ₹70,000',
                postedBy: providers[0]._id
            },
            {
                title: 'Backend Engineer (Node.js)',
                company: 'Malabar Tech Park',
                location: 'Kozhikode, Kerala',
                description: 'Scaling our backend infrastructure using Node.js and AWS.',
                requirements: ['Node.js', 'AWS', 'Redis', 'PostgreSQL'],
                experienceLevel: 'Senior',
                type: 'Full-time',
                salaryRange: '₹90,000 - ₹1,40,000',
                postedBy: providers[1]._id
            }
        ]);

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
