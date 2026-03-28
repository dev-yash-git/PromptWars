const { v4: uuidv4 } = require('uuid');

class StoreService {
    constructor() {
        this.issues = [];
        this.comments = [];
        this.upvotes = {}; // map of issueId to upvote count
    }

    addIssue(issueData) {
        const newIssue = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            status: 'Submitted',
            upvotes: 0,
            comments: [],
            ...issueData
        };
        this.issues.push(newIssue);
        this.upvotes[newIssue.id] = 0;
        return newIssue;
    }

    getAllIssues() {
        return this.issues.map(issue => ({
            ...issue,
            upvotes: this.upvotes[issue.id] || 0
        }));
    }

    upvoteIssue(issueId) {
        if (this.upvotes[issueId] !== undefined) {
            this.upvotes[issueId]++;
            const issue = this.issues.find(i => i.id === issueId);
            if (issue) issue.upvotes = this.upvotes[issueId];
            return this.upvotes[issueId];
        }
        return null;
    }

    addComment(issueId, commentText) {
        const comment = { id: uuidv4(), text: commentText, timestamp: new Date().toISOString() };
        const issue = this.issues.find(i => i.id === issueId);
        if (issue) {
            issue.comments.push(comment);
            return comment;
        }
        return null;
    }

    getStats() {
        const categories = {};
        const severityMap = {};
        
        this.issues.forEach(i => {
            const cat = i.ai_data?.issue_type || "Other";
            categories[cat] = (categories[cat] || 0) + 1;
            
            const sev = i.ai_data?.severity || "LOW";
            severityMap[sev] = (severityMap[sev] || 0) + 1;
        });

        return {
            totalIssues: this.issues.length,
            categories: Object.entries(categories).map(([name, value]) => ({ name, value })),
            severityDistribution: Object.entries(severityMap).map(([name, value]) => ({ name, value })),
            mostReported: Object.entries(categories).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None'
        };
    }
}

module.exports = new StoreService();
