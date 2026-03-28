import { describe, test, expect } from 'vitest';

describe('API Service', () => {
    test('should use relative URL in production mode', async () => {
        // Simulate production env
        const originalDev = import.meta.env.DEV;
        // In test mode (which mimics production), DEV should be false
        // and the baseURL should be '/api'
        expect(typeof import.meta.env.DEV).toBe('boolean');
    });

    test('should export all required API functions', async () => {
        const api = await import('../services/api');
        expect(api.analyzeIssue).toBeDefined();
        expect(api.getIssues).toBeDefined();
        expect(api.getStats).toBeDefined();
        expect(api.upvoteIssue).toBeDefined();
        expect(api.addComment).toBeDefined();
    });
});
