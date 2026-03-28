import React, { useState, useEffect } from 'react';
import { Mic, Image as ImageIcon, MapPin, Send, Loader2, X } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useGeolocation } from '../hooks/useGeolocation';

const IssueInput = ({ onAnalyze, isLoading }) => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { isListening, transcript, startListening, stopListening } = useSpeechToText();
    const { location, error: geoError } = useGeolocation();

    useEffect(() => {
        if (transcript) {
            setDescription(prev => prev + ' ' + transcript);
        }
    }, [transcript]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!description.trim()) {
            alert("Please provide a description of the issue.");
            return;
        }
        
        const formData = new FormData();
        formData.append('description', description);
        if (image) formData.append('image', image);
        if (location) formData.append('location', JSON.stringify(location));

        onAnalyze(formData);
    };

    return (
        <section className="glass p-8 mb-8 animate-slide-up">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-accent" />
                Report a Civic Issue
            </h2>
            
            <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:ring-2 focus:ring-accent mb-4"
                rows="4"
                placeholder="Describe what's wrong (e.g., street light flickering, illegal dumping...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {imagePreview && (
                <div className="relative w-32 h-32 mb-4 group">
                    <img src={imagePreview} className="w-full h-full object-cover rounded-lg border border-slate-700" alt="Preview" />
                    <button 
                        onClick={() => { setImage(null); setImagePreview(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    <button 
                        onClick={isListening ? stopListening : startListening}
                        className={`btn icon-btn ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : ''}`}
                        title="Voice Input"
                    >
                        <Mic className="w-5 h-5" />
                        {isListening ? 'Listening...' : 'Voice'}
                    </button>
                    
                    <label className="btn icon-btn cursor-pointer" title="Upload Image">
                        <ImageIcon className="w-5 h-5" />
                        <span>Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>

                    <div className="btn icon-btn text-muted" title="Location Info">
                        <MapPin className={`w-5 h-5 ${location ? 'text-green-500' : 'text-slate-500'}`} />
                        <span>{location ? 'Located' : 'Detecting...'}</span>
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="btn primary-btn min-w-[150px]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isLoading ? 'Analyzing...' : 'Analyze Issue'}
                </button>
            </div>
            
            {geoError && <p className="text-xs text-red-400 mt-2">Location Error: {geoError}</p>}
        </section>
    );
};

export default IssueInput;
