const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

dotenv.config({ path: './.env' });

const fixJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smarthire');
        const res = await Job.updateMany({ status: { $exists: false } }, { status: 'active' });
        console.log('Update result:', res);
        
        // Also ensure they have a valid postedBy if missing
        const provider = await mongoose.model('User').findOne({ role: 'job_provider' });
        if (provider) {
            const res2 = await Job.updateMany({ postedBy: { $exists: false } }, { postedBy: provider._id });
            console.log('Update postedBy result:', res2);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixJobs();
