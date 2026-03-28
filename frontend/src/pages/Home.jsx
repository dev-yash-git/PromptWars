import React, { useState, useEffect } from 'react';
import IssueInput from '../components/IssueInput';
import IssueCard from '../components/IssueCard';
import { analyzeIssue, getIssues } from '../services/api';

const Home = () => {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await getIssues();
                setIssues(data.reverse());
            } catch (error) {
                console.error(error);
            }
        };
        fetchIssues();
    }, []);

    const handleAnalyze = async (formData) => {
        setIsLoading(true);
        try {
            const newIssue = await analyzeIssue(formData);
            setIssues(prev => [newIssue, ...prev]);
        } catch (error) {
            alert("Error analyzing issue: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateIssue = (updatedIssue) => {
        setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
    };

    return (
        <main className="container">
            <IssueInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            
            <section className="space-y-4">
                <h2 className="text-xl font-bold mb-4 px-2">Recent Reports {issues.length > 0 && `(${issues.length})`}</h2>
                {issues.length === 0 && !isLoading && (
                    <div className="glass p-12 text-center text-muted animate-slide-up">
                        No reports yet. Start by describing an issue above.
                    </div>
                )}
                {issues.map((issue) => (
                    <IssueCard 
                        key={issue.id} 
                        issue={issue} 
                        onUpdate={handleUpdateIssue} 
                    />
                ))}
            </section>
        </main>
    );
};

export default Home;
