import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, ExternalLink, MessageCircle, ThumbsUp } from 'lucide-react';
import { upvoteIssue, addComment } from '../services/api';

const IssueCard = ({ issue, onUpdate }) => {
    const [newComment, setNewComment] = useState('');
    const { ai_data, status, upvotes, id, priorityScore, confidenceScore, verification_status } = issue;

    const handleUpvote = async () => {
        try {
            const data = await upvoteIssue(id);
            onUpdate({ ...issue, upvotes: data.upvotes });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const comment = await addComment(id, newComment);
            onUpdate({ ...issue, comments: [...issue.comments, comment] });
            setNewComment('');
        } catch (error) {
            console.error(error);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ai_data.complaint_draft);
        alert("Complaint draft copied to clipboard!");
    };

    const getSeverityClass = (sev) => {
        const s = sev?.toLowerCase() || 'low';
        return `badge badge-${s}`;
    };

    return (
        <article className="glass p-8 mb-8 animate-slide-up flex flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="text-muted text-xs font-mono uppercase tracking-widest">ID: {id.slice(0, 8)}</span>
                        <span className={getSeverityClass(ai_data.severity)}>{ai_data.severity}</span>
                    </div>
                    <h3 className="text-xl font-bold text-accent">{ai_data.issue_type}</h3>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-muted uppercase">Priority Score</p>
                        <p className="text-2xl font-black text-white">{priorityScore}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted font-mono uppercase">Status</p>
                        <p className="text-sm font-bold text-accent px-3 py-1 bg-accent/10 rounded border border-accent/20">{status}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                             <AlertCircle className="w-4 h-4 text-accent" /> Description
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{ai_data.description}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Responsible Dept</h4>
                        <p className="text-slate-400 text-sm">{ai_data.responsible_department}</p>
                    </div>
                    <div className="pt-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs text-muted">Confidence Score</span>
                            <span className="text-xs text-accent font-bold">{confidenceScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${confidenceScore}%` }}></div>
                        </div>
                        <p className="text-[10px] text-muted mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> {verification_status}
                        </p>
                    </div>
                </div>

                <div className="glass bg-white/5 p-6 rounded-xl space-y-4 border-white/5">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between">
                         Complaint Draft
                         <button onClick={copyToClipboard} className="btn icon-btn p-1.5" title="Copy Text"><Copy className="w-4 h-4" /></button>
                    </h4>
                    <pre className="text-xs bg-black/30 p-4 rounded-lg text-slate-400 font-sans whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {ai_data.complaint_draft}
                    </pre>
                    <div className="flex gap-2">
                         <a href="https://bbmpsahaaya.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="btn icon-btn flex-1 text-xs py-2 bg-accent/20 border-accent/30 text-accent">
                             BBMP Sahaaya <ExternalLink className="w-3 h-3" />
                         </a>
                         <a href="https://swachhbharatmission.ddp.gov.in/" target="_blank" rel="noopener noreferrer" className="btn icon-btn flex-1 text-xs py-2">
                             Swachhata App <ExternalLink className="w-3 h-3" />
                         </a>
                    </div>
                </div>
            </div>

            <footer className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center gap-6">
                    <button onClick={handleUpvote} className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors text-sm font-bold">
                        <ThumbsUp className="w-4 h-4" /> {upvotes} Upvotes
                    </button>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                        <MessageCircle className="w-4 h-4" /> {issue.comments?.length || 0} Comments
                    </div>
                </div>

                <div className="flex gap-2">
                    <input 
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white" 
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                </div>
                {issue.comments?.length > 0 && (
                     <div className="space-y-2 mt-2">
                         {issue.comments.slice(-2).map((c) => (
                             <div key={c.id} className="text-[11px] bg-white/5 p-2 rounded text-slate-400 border-l-2 border-accent/30">
                                 {c.text}
                             </div>
                         ))}
                     </div>
                )}
            </footer>
        </article>
    );
};

export default IssueCard;
