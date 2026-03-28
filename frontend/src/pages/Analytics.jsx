import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { TrendingUp, Award, Layers } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="container text-center py-20 text-muted">Loading Analytics...</div>;

    return (
        <div className="container py-8 flex flex-col gap-12">
            <header className="text-left animate-slide-up">
                <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
                    <TrendingUp className="text-accent" /> Civic Analytics Dashboard
                </h1>
                <p className="text-muted text-sm">Real-time insights and data-driven prioritization for city improvements.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                <div className="glass p-6 border-l-4 border-accent">
                    <p className="text-xs text-muted uppercase font-bold mb-1">Total Reports</p>
                    <p className="text-4xl font-black">{stats.totalIssues}</p>
                </div>
                <div className="glass p-6 border-l-4 border-purple-500">
                    <p className="text-xs text-muted uppercase font-bold mb-1">Most Reported</p>
                    <p className="text-2xl font-black overflow-hidden text-ellipsis">{stats.mostReported}</p>
                </div>
                <div className="glass p-6 border-l-4 border-orange-500">
                    <p className="text-xs text-muted uppercase font-bold mb-1">System Efficiency</p>
                    <p className="text-4xl font-black">94% <span className="text-xs font-normal text-muted">Mocked</span></p>
                </div>
            </section>

            <AnalyticsCharts data={stats} />

            <section className="glass p-8 animate-slide-up">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Award className="text-accent" /> Performance Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="p-2 bg-accent/20 rounded text-accent"><Layers className="w-4 h-4" /></div>
                            <div>
                                <h4 className="text-sm font-bold mb-1">Infrastructure Focus</h4>
                                <p className="text-xs text-muted">80% of current high-priority issues are related to road maintenance.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="p-2 bg-purple-500/20 rounded text-purple-400"><Layers className="w-4 h-4" /></div>
                            <div>
                                <h4 className="text-sm font-bold mb-1">Resolution Time</h4>
                                <p className="text-xs text-muted">Average simulated response time has decreased by 12% this month.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-accent/5 p-6 rounded-xl border border-accent/10 flex flex-col justify-center text-center">
                        <p className="text-sm text-accent font-bold mb-4 italic">"Data-driven city management transforms lives by focusing on the issues that matter most to citizens."</p>
                        <p className="text-xs text-muted">— CivicFix AI Vision</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Analytics;
