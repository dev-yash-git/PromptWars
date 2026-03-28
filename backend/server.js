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

// Serve frontend static files
const possiblePaths = [
    path.join(__dirname, '../frontend/dist'),
    path.join(process.cwd(), 'frontend/dist'),
    path.join(__dirname, 'public'),
];

let frontendServed = false;
for (const p of possiblePaths) {
    console.log(`Checking frontend path: ${p} -> exists: ${fs.existsSync(p)}`);
    if (fs.existsSync(p)) {
        console.log(`Serving frontend from ${p}`);
        app.use(express.static(p));
        app.get('*', (req, res) => {
            if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
                res.sendFile(path.join(p, 'index.html'));
            }
        });
        frontendServed = true;
        break;
    }
}

if (!frontendServed) {
    console.warn('WARNING: No frontend dist found. API-only mode.');
    app.get('/', (req, res) => {
        res.json({ status: 'running', mode: 'api-only', message: 'Frontend dist not found. Check Dockerfile build step.' });
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicFix AI Backend started on port ${PORT}`);
    console.log(`__dirname: ${__dirname}`);
    console.log(`cwd: ${process.cwd()}`);
});
