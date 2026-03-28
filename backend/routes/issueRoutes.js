/**
 * @module IssueRoutes
 * @description Express routes for civic issue management.
 * Includes input validation and rate limiting on sensitive endpoints.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const issueController = require('../controllers/issueController');
const { analyzeIssueRules, addCommentRules, upvoteRules } = require('../middleware/validators');
const { analysisLimiter } = require('../middleware/security');

const router = express.Router();

// Secure file upload with type + size restrictions
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
        }
    },
});

// ── Core Analysis (with rate limiting + validation) ──────────────────
router.post(
    '/analyze-issue',
    analysisLimiter,
    upload.single('image'),
    analyzeIssueRules,
    issueController.analyzeIssue
);

// ── Data Retrieval ───────────────────────────────────────────────────
router.get('/issues', issueController.getAllIssues);
router.get('/stats', issueController.getStats);

// ── Community Interaction (with validation) ──────────────────────────
router.post('/issues/:id/upvote', upvoteRules, issueController.upvoteIssue);
router.post('/issues/:id/comment', addCommentRules, issueController.addComment);

module.exports = router;
