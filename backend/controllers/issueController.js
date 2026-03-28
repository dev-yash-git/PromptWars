const aiService = require("../services/aiService");
const storeService = require("../services/storeService");

const analyzeIssue = async (req, res) => {
    try {
        const { description, location } = req.body;
        // Image handling is mock for now
        const imageUrl = req.file ? req.file.path : null;

        if (!description) {
            return res.status(400).json({ error: "Missing issue description." });
        }

        const aiData = await aiService.analyzeIssue(description, imageUrl);

        // Verification logic: 429
        const isHazard = /fire|accident|wire|flood|broken|injury|danger/i.test(description);
        if (isHazard) aiData.severity = "CRITICAL";

        // Generate priority score (0-100)
        let priorityScore = Math.floor(Math.random() * 20) + 70; // High default
        if (aiData.severity === "CRITICAL") priorityScore = 95;
        if (aiData.severity === "LOW") priorityScore = 40;

        const issue = storeService.addIssue({
            description,
            location: location || "Manual Location Trace Placeholder",
            ai_data: aiData,
            image_url: imageUrl,
            priorityScore,
            confidenceScore: Math.floor(Math.random() * 15) + 85, // 85-100%
            verification_status: isHazard ? "LIKELY_VALID" : "NEEDS_REVIEW"
        });

        res.json(issue);
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const getAllIssues = (req, res) => {
    res.json(storeService.getAllIssues());
};

const getStats = (req, res) => {
    res.json(storeService.getStats());
};

const upvoteIssue = (req, res) => {
    const { id } = req.params;
    const upvotes = storeService.upvoteIssue(id);
    if (upvotes !== null) {
        res.json({ success: true, upvotes });
    } else {
        res.status(404).json({ error: "Issue not found." });
    }
};

const addComment = (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = storeService.addComment(id, text);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({ error: "Issue not found." });
    }
};

module.exports = {
    analyzeIssue,
    getAllIssues,
    getStats,
    upvoteIssue,
    addComment
};
