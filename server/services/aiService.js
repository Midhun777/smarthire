const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const pdf = require('pdf-parse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Using gemini-3-flash-preview per user request
const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Helper to retry AI calls on transient failures (503, 504)
 * Uses simple exponential backoff
 */
const withRetry = async (fn, maxRetries = 3, baseDelay = 2000) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const isTransient = error.message && (
                error.message.includes("503") || 
                error.message.includes("504") || 
                error.message.includes("Service Unavailable") ||
                error.message.includes("overloaded")
            );

            if (isTransient && i < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, i);
                console.log(`[aiService] Transient error (503/504). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
};

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
                    { "title": "Job Title", "company": "Company Name", "duration": "Duration", "description": "Brief summary" }
                ],
                "education": [
                    { "school": "University/School", "degree": "Degree", "year": "Graduation Year" }
                ]
            }
            Do not include any conversational filler or character prefix/suffix.
            
            RESUME TEXT:
            ${text.substring(0, 15000)}
        `;

        const result = await withRetry(() => model.generateContent(prompt));
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

        // Handle 429 Quota Exceeded specifically
        if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
            return {
                error: "AI Quota Exceeded. Please wait a few seconds before retrying or continue manually.",
                skills: [],
                experience: []
            };
        }

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

        const result = await withRetry(() => model.generateContent(prompt));
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

        if (error.message && (error.message.includes("429") || error.message.includes("quota"))) {
            return {
                matchPercentage: 0,
                missingSkills: [],
                reason: "AI Quota limit reached. Falling back to secure local matching."
            };
        }

        return { matchPercentage: 0, missingSkills: [], reason: "Error in AI processing" };
    }
};

/**
 * Calculates a match score locally using skill comparison.
 * This is used as a fallback or primary method when AI is not desired.
 */
const calculateLocalMatch = (userSkills, job) => {
    try {
        const skills = (userSkills || []).map(s => s.toLowerCase().trim()).filter(s => s.length > 1);
        const jobRequirements = (job.requirements || []).map(r => r.toLowerCase().trim()).filter(r => r.length > 1);
        const jobTags = (job.aiTags || []).map(t => t.toLowerCase().trim()).filter(t => t.length > 1);
        const combinedRequirements = [...new Set([...jobRequirements, ...jobTags])];

        if (combinedRequirements.length === 0) {
            return {
                matchPercentage: 50,
                missingSkills: [],
                reason: "Matched based on general profile alignment."
            };
        }

        const isMatch = (skill, req) => {
            return skill === req || 
                   (skill.length >= 3 && req.includes(skill)) || 
                   (req.length >= 3 && skill.includes(req));
        };

        const matchedSkills = combinedRequirements.filter(req =>
            skills.some(skill => isMatch(skill, req))
        );

        const missingSkills = combinedRequirements.filter(req =>
            !skills.some(skill => isMatch(skill, req))
        );

        const matchPercentage = Math.round((matchedSkills.length / combinedRequirements.length) * 100);

        let reason = "";
        if (matchPercentage > 80) {
            reason = "Excellent match! Your skills align perfectly with the core requirements.";
        } else if (matchPercentage > 50) {
            reason = "Strong candidate. You possess most of the required expertise for this role.";
        } else if (matchPercentage > 20) {
            reason = "Good potential. Some key skills are missing, but your core experience is relevant.";
        } else {
            reason = "Emerging match. Broadening your toolkit with the missing skills would increase alignment.";
        }

        return {
            matchPercentage,
            missingSkills: missingSkills.slice(0, 5),
            reason
        };
    } catch (error) {
        console.error("Local Match Error:", error);
        return { matchPercentage: 0, missingSkills: [], reason: "Calculation error" };
    }
};

module.exports = { extractSkillsFromResume, matchJobToProfile, calculateLocalMatch };
