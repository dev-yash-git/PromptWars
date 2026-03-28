const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { helmetMiddleware, apiLimiter } = require('./middleware/security');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// ── Security Middleware ──────────────────────────────────────────────
app.use(helmetMiddleware);
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '*']
        : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Standard Middleware ──────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Rate Limiting ────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Upload Directory ─────────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// ── API Routes ───────────────────────────────────────────────────────
const issueRoutes = require('./routes/issueRoutes');
app.use('/api', issueRoutes);

// ── Health Check ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'CivicFix AI Backend',
        version: '1.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ── Frontend Static Serving ──────────────────────────────────────────
const possiblePaths = [
    path.join(__dirname, '../frontend/dist'),
    path.join(process.cwd(), 'frontend/dist'),
    path.join(__dirname, 'public'),
];

let frontendServed = false;
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        console.log(`[BOOT] Serving frontend from ${p}`);
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
    console.warn('[BOOT] WARNING: No frontend dist found. API-only mode.');
    app.get('/', (req, res) => {
        res.json({ status: 'running', mode: 'api-only' });
    });
}

// ── Global Error Handler ─────────────────────────────────────────────
app.use((err, req, res, _next) => {
    console.error('[ERROR]', err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

// ── Start Server (only if not in test mode) ──────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[BOOT] CivicFix AI Backend v1.0.0 on port ${PORT}`);
    });
}

module.exports = app;
