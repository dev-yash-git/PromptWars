/**
 * @file api.test.js
 * @description Integration tests for backend API endpoints.
 * Uses supertest to simulate HTTP requests against the Express app.
 */

const request = require('supertest');
const app = require('../server');

describe('API Integration Tests', () => {
    describe('GET /health', () => {
        test('should return 200 with service status', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('ok');
            expect(res.body.service).toBe('CivicFix AI Backend');
            expect(res.body).toHaveProperty('version');
            expect(res.body).toHaveProperty('uptime');
        });
    });

    describe('GET /api/issues', () => {
        test('should return empty array initially', async () => {
            const res = await request(app).get('/api/issues');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('GET /api/stats', () => {
        test('should return stats object with required fields', async () => {
            const res = await request(app).get('/api/stats');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('totalIssues');
            expect(res.body).toHaveProperty('categories');
            expect(res.body).toHaveProperty('severityDistribution');
            expect(res.body).toHaveProperty('mostReported');
        });
    });

    describe('POST /api/analyze-issue', () => {
        test('should return 400 when description is missing', async () => {
            const res = await request(app)
                .post('/api/analyze-issue')
                .send({});
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        test('should return 400 when description is too short', async () => {
            const res = await request(app)
                .post('/api/analyze-issue')
                .send({ description: 'short' });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });
    });

    describe('POST /api/issues/:id/upvote', () => {
        test('should return 400 for invalid UUID format', async () => {
            const res = await request(app)
                .post('/api/issues/not-a-uuid/upvote');
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });

        test('should return 404 for non-existent valid UUID', async () => {
            const res = await request(app)
                .post('/api/issues/550e8400-e29b-41d4-a716-446655440000/upvote');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /api/issues/:id/comment', () => {
        test('should return 400 when comment text is empty', async () => {
            const res = await request(app)
                .post('/api/issues/550e8400-e29b-41d4-a716-446655440000/comment')
                .send({ text: '' });
            expect(res.status).toBe(400);
        });

        test('should return 400 for invalid issue ID', async () => {
            const res = await request(app)
                .post('/api/issues/bad-id/comment')
                .send({ text: 'Hello' });
            expect(res.status).toBe(400);
        });
    });

    describe('Security Headers', () => {
        test('should include Helmet security headers', async () => {
            const res = await request(app).get('/health');
            expect(res.headers).toHaveProperty('x-content-type-options');
            expect(res.headers['x-content-type-options']).toBe('nosniff');
        });

        test('should include X-Frame-Options header', async () => {
            const res = await request(app).get('/health');
            expect(res.headers).toHaveProperty('x-frame-options');
        });
    });
});
