const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const pdf = require('pdf-parse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Using gemini-1.5-flash for better stability and speed
const MODEL_NAME = "gemini-2.5-flash";

const extractSkillsFromResume = async (filePath, mimeType) => {
    try {
        let text = "";
        if (mimeType === 'application/pdf') {
            try {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdf(dataBuffer);
                text = data.text;
                console.log(`[aiService] Parsed PDF text length: ${text.length}`);
            } catch (pdfErr) {
                console.error("PDF Parse Error:", pdfErr);
                throw new Error("The PDF file appears to be corrupted or its structure is not supported.");
            }
        } else {
            throw new Error("Only PDF supported for now");
        }

        if (!text || text.trim().length < 50) {
            throw new Error("Resume text is too short or empty. Please check the file content.");
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API Key is not configured in environment variables.");
        }

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
            Extract technical skills and professional experience from the following resume text.
            Return ONLY a valid JSON object with this exact structure:
            {
                "skills": ["skill1", "skill2"],
                "experience": [
                    { "role": "Job Title", "company": "Company Name", "duration": "Duration", "description": "Brief summary" }
                ]
            }
            Do not include any conversational filler or character prefix/suffix.
            
            RESUME TEXT:
            ${text.substring(0, 15000)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();
        console.log(`[aiService] AI Response received: ${textResponse.substring(0, 100)}...`);

        // More robust JSON extraction
        let jsonString = textResponse;
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        } else {
            console.error("No JSON found in AI response:", textResponse);
            throw new Error("Failed to parse AI response structure");
        }

        try {
            const parsedData = JSON.parse(jsonString);
            return {
                ...parsedData,
                rawText: text
            };
        } catch (parseErr) {
            console.error("JSON Parse Error:", parseErr, "Content:", jsonString);
            throw new Error("Invalid JSON returned by AI");
        }

    } catch (error) {
        console.error("AI Error (Extraction):", error);
        return { error: error.message, skills: [], experience: [] };
    }
};

const matchJobToProfile = async (resumeText, jobDescription) => {
    try {
        if (!resumeText || !jobDescription) {
            return { matchPercentage: 0, reason: "Resume or Job Description missing", missingSkills: [] };
        }

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const prompt = `
            Compare the following Resume and Job Description.
            Calculate a match percentage (0-100), identify missing skills, and provide a brief reasoning.
            Return ONLY a valid JSON object with this exact structure:
            {
                "matchPercentage": 85,
                "missingSkills": ["skill1", "skill2"],
                "reason": "Brief explanation of why this score was given"
            }
            Do not include any markdown formatting like \`\`\`json. Just the raw JSON string.

            RESUME:
            ${resumeText.substring(0, 8000)}

            JOB DESCRIPTION:
            ${jobDescription.substring(0, 8000)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        let jsonString = textResponse;
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        } else {
            console.error("No JSON found in Match Response:", textResponse);
            throw new Error("Failed to parse AI match response structure");
        }

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("AI Match Error:", error);
        return { matchPercentage: 0, missingSkills: [], reason: "Error in AI processing" };
    }
};

module.exports = { extractSkillsFromResume, matchJobToProfile };
