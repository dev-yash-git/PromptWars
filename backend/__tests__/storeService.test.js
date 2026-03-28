/**
 * @file storeService.test.js
 * @description Unit tests for the in-memory StoreService.
 * Covers issue CRUD, upvoting, commenting, and stats aggregation.
 */

// Reset the singleton between tests
let storeService;

beforeEach(() => {
    jest.resetModules();
    storeService = require('../services/storeService');
    // Clear in-memory state
    storeService.issues = [];
    storeService.comments = [];
    storeService.upvotes = {};
});

describe('StoreService', () => {
    describe('addIssue()', () => {
        test('should create an issue with a unique UUID and timestamp', () => {
            const issue = storeService.addIssue({
                description: 'Pothole on MG Road',
                ai_data: { issue_type: 'Infrastructure', severity: 'HIGH' },
            });

            expect(issue).toHaveProperty('id');
            expect(issue.id).toMatch(/^[0-9a-f-]{36}$/);
            expect(issue).toHaveProperty('timestamp');
            expect(issue.status).toBe('Submitted');
            expect(issue.upvotes).toBe(0);
            expect(issue.comments).toEqual([]);
            expect(issue.description).toBe('Pothole on MG Road');
        });

        test('should store multiple issues independently', () => {
            storeService.addIssue({ description: 'Issue 1', ai_data: {} });
            storeService.addIssue({ description: 'Issue 2', ai_data: {} });

            const all = storeService.getAllIssues();
            expect(all).toHaveLength(2);
        });
    });

    describe('getAllIssues()', () => {
        test('should return empty array when no issues exist', () => {
            expect(storeService.getAllIssues()).toEqual([]);
        });

        test('should include upvote count in returned issues', () => {
            const issue = storeService.addIssue({ description: 'Test', ai_data: {} });
            storeService.upvoteIssue(issue.id);
            storeService.upvoteIssue(issue.id);

            const issues = storeService.getAllIssues();
            expect(issues[0].upvotes).toBe(2);
        });
    });

    describe('upvoteIssue()', () => {
        test('should increment upvote count', () => {
            const issue = storeService.addIssue({ description: 'Test', ai_data: {} });
            const count = storeService.upvoteIssue(issue.id);
            expect(count).toBe(1);
        });

        test('should return null for non-existent issue ID', () => {
            const result = storeService.upvoteIssue('non-existent-id');
            expect(result).toBeNull();
        });
    });

    describe('addComment()', () => {
        test('should add a comment with UUID and timestamp', () => {
            const issue = storeService.addIssue({ description: 'Test', ai_data: {} });
            const comment = storeService.addComment(issue.id, 'Great report!');

            expect(comment).toHaveProperty('id');
            expect(comment).toHaveProperty('timestamp');
            expect(comment.text).toBe('Great report!');
        });

        test('should return null for non-existent issue', () => {
            const result = storeService.addComment('fake-id', 'No issue');
            expect(result).toBeNull();
        });

        test('should append multiple comments to the same issue', () => {
            const issue = storeService.addIssue({ description: 'Test', ai_data: {} });
            storeService.addComment(issue.id, 'Comment 1');
            storeService.addComment(issue.id, 'Comment 2');

            const issues = storeService.getAllIssues();
            expect(issues[0].comments).toHaveLength(2);
        });
    });

    describe('getStats()', () => {
        test('should return zero stats for empty store', () => {
            const stats = storeService.getStats();
            expect(stats.totalIssues).toBe(0);
            expect(stats.categories).toEqual([]);
            expect(stats.severityDistribution).toEqual([]);
            expect(stats.mostReported).toBe('None');
        });

        test('should aggregate categories and severity correctly', () => {
            storeService.addIssue({ description: 'A', ai_data: { issue_type: 'Roads', severity: 'HIGH' } });
            storeService.addIssue({ description: 'B', ai_data: { issue_type: 'Roads', severity: 'LOW' } });
            storeService.addIssue({ description: 'C', ai_data: { issue_type: 'Water', severity: 'HIGH' } });

            const stats = storeService.getStats();
            expect(stats.totalIssues).toBe(3);
            expect(stats.mostReported).toBe('Roads');
            expect(stats.categories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Roads', value: 2 }),
                    expect.objectContaining({ name: 'Water', value: 1 }),
                ])
            );
        });
    });
});
