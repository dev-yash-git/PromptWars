const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWithRetry = async (description, imageUrl = null, retries = 3, delay = 2000) => {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
    Analyze this civic issue description: "${description}"
    ${imageUrl ? "Note: An image has been attached to this report." : ""}
    
    Return a valid JSON object with the following keys:
    - issue_type: (String) Unified category.
    - severity: (String) [LOW, MEDIUM, HIGH, CRITICAL]
    - description: (String) Concise summary.
    - responsible_department: (String) Dept name.
    - immediate_actions: (Array) Short-term steps for the citizen.
    - next_steps: (Array) Long-term resolution steps.
    - complaint_draft: (String) Ready-to-use formal complaint text.
    - confidence_score: (Number) 0-100 based on description clarity.
    
    If the description includes keywords like "fire", "accident", "broken wire", "flood", set severity to CRITICAL.
    
    Return ONLY raw JSON, no markdown formatting.
    `;

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().trim();
            
            if (text.startsWith("```json")) {
                text = text.split("```json")[1].split("```")[0];
            } else if (text.startsWith("```")) {
                text = text.split("```")[1].split("```")[0];
            }

            return JSON.parse(text);
        } catch (error) {
            console.error(`Attempt ${i + 1} failed. Status: ${error.status}`);
            
            if (i < retries - 1 && (error.status === 503 || error.status === 429)) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 1.5; // Exponential backoff
                continue;
            }

            console.error("AI Service Error - Details:", JSON.stringify(error, null, 2));
            
            let message = "Failed to analyze civic issue via AI.";
            if (error.status === 429) {
                message = "Gemini API Quota exceeded. Please try again after a minute.";
            } else if (error.status === 503) {
                message = "The AI service is currently overloaded. Please try again in a few seconds.";
            } else if (error.status === 404) {
                message = "Model gemini-1.5-flash not found or unsupported.";
            }
            
            throw new Error(message);
        }
    }
};

const analyzeIssue = async (description, imageUrl = null) => {
    return analyzeWithRetry(description, imageUrl);
};

module.exports = { analyzeIssue };
