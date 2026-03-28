/**
 * @module InputValidator
 * @description Express-validator middleware for validating API inputs.
 * Ensures all user-facing endpoints receive safe, well-formed data.
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to check for validation errors.
 * Returns 400 with structured error messages if validation fails.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(e => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
};

/**
 * Validation rules for the /analyze-issue endpoint.
 */
const analyzeIssueRules = [
    body('description')
        .trim()
        .notEmpty().withMessage('Issue description is required.')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.')
        .isLength({ max: 5000 }).withMessage('Description must not exceed 5000 characters.'),
    handleValidationErrors,
];

/**
 * Validation rules for the /issues/:id/comment endpoint.
 */
const addCommentRules = [
    param('id').isUUID().withMessage('Invalid issue ID format.'),
    body('text')
        .trim()
        .notEmpty().withMessage('Comment text is required.')
        .isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters.'),
    handleValidationErrors,
];

/**
 * Validation rules for the /issues/:id/upvote endpoint.
 */
const upvoteRules = [
    param('id').isUUID().withMessage('Invalid issue ID format.'),
    handleValidationErrors,
];

module.exports = {
    analyzeIssueRules,
    addCommentRules,
    upvoteRules,
    handleValidationErrors,
};
