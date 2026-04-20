const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Job  = require('./models/Job');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smarthire')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => { console.error(err); process.exit(1); });

const run = async () => {
    try {
        /* ----------------------------------------------------------
           1. Create (or reuse) the provider account
        ---------------------------------------------------------- */
        const EMAIL    = 'testprovider@smarthire.com';
        const PASSWORD = 'Provider@123';

        let provider = await User.findOne({ email: EMAIL });

        if (!provider) {
            provider = await User.create({
                name: 'TechNova Solutions',
                email: EMAIL,
                password: PASSWORD,          // plain text (project standard)
                role: 'job_provider',
                isProfileComplete: true,
                isVerified: true
            });
            console.log('Provider created');
        } else {
            console.log('Provider already exists — reusing');
        }

        /* ----------------------------------------------------------
           2. Delete old jobs by this provider (clean slate)
        ---------------------------------------------------------- */
        await Job.deleteMany({ postedBy: provider._id });

        /* ----------------------------------------------------------
           3. Create 5 jobs
        ---------------------------------------------------------- */
        const jobs = await Job.insertMany([
            {
                title: 'Full Stack Developer',
                company: 'TechNova Solutions',
                location: 'Kochi, Kerala',
                description: 'We are looking for an experienced Full Stack Developer to build scalable web applications using React and Node.js. You will work closely with product and design teams to deliver high-quality software.',
                requirements: ['React', 'Node.js', 'MongoDB', 'REST API', 'JavaScript', 'Git'],
                aiTags: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Full Stack'],
                salaryRange: '₹8L – ₹14L / year',
                experienceLevel: 'Mid Level',
                type: 'Full-time',
                status: 'active',
                postedBy: provider._id
            },
            {
                title: 'Machine Learning Engineer',
                company: 'TechNova Solutions',
                location: 'Bangalore (Remote OK)',
                description: 'Join our AI division as an ML Engineer and work on cutting-edge NLP and computer vision models. You will design, train, and deploy ML pipelines that power our core recommendation systems.',
                requirements: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'NLP', 'Docker'],
                aiTags: ['Machine Learning', 'Python', 'AI', 'NLP', 'Deep Learning'],
                salaryRange: '₹12L – ₹20L / year',
                experienceLevel: 'Senior Level',
                type: 'Full-time',
                status: 'active',
                postedBy: provider._id
            },
            {
                title: 'UI/UX Designer',
                company: 'TechNova Solutions',
                location: 'Thiruvananthapuram, Kerala',
                description: 'Design elegant and intuitive user interfaces for our web and mobile products. You will create wireframes, prototypes, and design systems in Figma while collaborating closely with developers.',
                requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'CSS'],
                aiTags: ['UI Design', 'UX', 'Figma', 'Prototyping', 'Product Design'],
                salaryRange: '₹6L – ₹10L / year',
                experienceLevel: 'Entry Level',
                type: 'Full-time',
                status: 'active',
                postedBy: provider._id
            },
            {
                title: 'DevOps Engineer',
                company: 'TechNova Solutions',
                location: 'Remote',
                description: 'We need a DevOps Engineer to manage our cloud infrastructure on AWS, implement CI/CD pipelines, and ensure 99.9% uptime. You will work on containerisation with Docker and Kubernetes.',
                requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
                aiTags: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'Cloud Infrastructure'],
                salaryRange: '₹10L – ₹18L / year',
                experienceLevel: 'Mid Level',
                type: 'Remote',
                status: 'active',
                postedBy: provider._id
            },
            {
                title: 'Data Analyst',
                company: 'TechNova Solutions',
                location: 'Kochi, Kerala',
                description: 'Analyse large datasets to extract meaningful business insights. You will build dashboards, run SQL queries, and present findings to leadership to drive data-driven decisions.',
                requirements: ['SQL', 'Python', 'Excel', 'Power BI', 'Data Visualisation', 'Statistics'],
                aiTags: ['Data Analysis', 'SQL', 'Python', 'Power BI', 'Business Intelligence'],
                salaryRange: '₹5L – ₹9L / year',
                experienceLevel: 'Entry Level',
                type: 'Full-time',
                status: 'active',
                postedBy: provider._id
            }
        ]);

        /* ----------------------------------------------------------
           4. Print summary
        ---------------------------------------------------------- */
        console.log('\n========================================');
        console.log('  TEST PROVIDER ACCOUNT');
        console.log('========================================');
        console.log(`  Provider ID : ${provider._id}`);
        console.log(`  Email       : ${EMAIL}`);
        console.log(`  Password    : ${PASSWORD}`);
        console.log('\n  Jobs Posted:');
        jobs.forEach((j, i) => {
            console.log(`  ${i + 1}. [${j._id}] ${j.title} — ${j.location} (${j.type})`);
        });
        console.log('========================================\n');

    } catch (err) {
        console.error('Seeder error:', err);
    } finally {
        mongoose.disconnect();
    }
};

run();
