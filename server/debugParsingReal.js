const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env BEFORE requiring aiService
dotenv.config({ path: path.join(__dirname, '.env') });

const { extractSkillsFromResume } = require('./services/aiService');
const uploadsDir = path.join(__dirname, 'uploads');

async function debugLatestUpload() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing in .env");
        return;
    }

    const files = fs.readdirSync(uploadsDir);
    if (files.length === 0) {
        console.log("No files in uploads/");
        return;
    }

    // Sort files by creation time to get the latest
    const fileStats = files.map(file => ({
        file,
        time: fs.statSync(path.join(uploadsDir, file)).ctime.getTime()
    }));
    fileStats.sort((a, b) => b.time - a.time);

    const latestFile = fileStats[0].file;
    const filePath = path.join(uploadsDir, latestFile);

    console.log(`--- Testing Latest File: ${latestFile} ---`);
    console.log(`Path: ${filePath}`);

    try {
        const result = await extractSkillsFromResume(filePath, 'application/pdf');

        if (result.error) {
            console.error("DEBUG ERROR:", result.error);
        } else {
            console.log("DEBUG SUCCESS!");
            console.log("Skills:", result.skills);
            console.log("Experience Count:", result.experience ? result.experience.length : 0);
        }

    } catch (error) {
        console.error("DEBUG CRITICAL ERROR:", error);
    }
}

debugLatestUpload();
