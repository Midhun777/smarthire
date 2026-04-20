const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config({ path: './.env' });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smarthire');
        const userCount = await User.countDocuments();
        const jobCount = await Job.countDocuments();
        const providerCount = await User.countDocuments({ role: 'job_provider' });
        
        const statusCounts = await Job.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        console.log(`Users: ${userCount}`);
        console.log(`Jobs: ${jobCount}`);
        console.log(`Providers: ${providerCount}`);
        console.log(`Job Statuses:`, JSON.stringify(statusCounts));
        
        // Check a random job
        const sampleJob = await Job.findOne();
        console.log(`Sample Job:`, JSON.stringify(sampleJob, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
