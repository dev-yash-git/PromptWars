const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static for uploads
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(path.join(__dirname, uploadDir)));

// Routes
const issueRoutes = require('./routes/issueRoutes');
app.use('/api', issueRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'CivicFix AI Backend' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicFix AI Backend (Production Revamp) started on http://127.0.0.1:${PORT}`);
});
