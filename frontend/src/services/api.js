import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5002/api'
});

export const analyzeIssue = async (formData) => {
    const response = await api.post('/analyze-issue', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getIssues = async () => {
    const response = await api.get('/issues');
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export const upvoteIssue = async (id) => {
    const response = await api.post(`/issues/${id}/upvote`);
    return response.data;
};

export const addComment = async (id, text) => {
    const response = await api.post(`/issues/${id}/comment`, { text });
    return response.data;
};

export default api;
