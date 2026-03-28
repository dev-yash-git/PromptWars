const express = require('express');
const multer = require('multer');
const issueController = require('../controllers/issueController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Core analysis
router.post('/analyze-issue', upload.single('image'), issueController.analyzeIssue);

// Data layer
router.get('/issues', issueController.getAllIssues);
router.get('/stats', issueController.getStats);

// Interaction
router.post('/issues/:id/upvote', issueController.upvoteIssue);
router.post('/issues/:id/comment', issueController.addComment);

module.exports = router;
