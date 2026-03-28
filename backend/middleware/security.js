/**
 * @module SecurityMiddleware
 * @description Centralized security middleware for CivicFix AI backend.
 * Implements Helmet for HTTP headers, rate limiting, and input sanitization.
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Configures Helmet for secure HTTP headers.
 * - CSP allows inline scripts/styles for React SPA.
 * - HSTS enforced for production HTTPS connections.
 */
const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiter for API routes.
 * Prevents abuse by limiting requests per IP.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again after 15 minutes.' },
});

/**
 * Stricter rate limiter for AI analysis endpoint.
 * Gemini API calls are expensive — protect against abuse.
 */
const analysisLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Max 10 analysis requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Analysis rate limit exceeded. Please wait a moment.' },
});

/**
 * Sanitizes string input to prevent XSS attacks.
 * Strips HTML tags and trims whitespace.
 * @param {string} input - Raw user input string.
 * @returns {string} Sanitized string.
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/<[^>]*>/g, '')    // Strip HTML tags
        .replace(/[<>"'`;()]/g, '') // Remove dangerous characters
        .trim()
        .slice(0, 5000);            // Max length protection
};

module.exports = {
    helmetMiddleware,
    apiLimiter,
    analysisLimiter,
    sanitizeInput,
};
