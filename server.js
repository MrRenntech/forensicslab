import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import loginsHandler from './api/login.js';
import statsHandler from './api/stats.js';
import studentsHandler from './api/students.js';
import activityHandler from './api/activity.js';
import scenariosHandler from './api/scenarios.js';
import submissionsHandler from './api/submissions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies (mimic Vercel)
app.use(express.json());

// API Routes - Manually wiring them to match Vercel file-system routing
app.get('/api/login', loginsHandler);
app.get('/api/stats', statsHandler);
app.get('/api/students', studentsHandler);
app.get('/api/activity', activityHandler);
app.get('/api/scenarios', scenariosHandler);
app.all('/api/scenarios', scenariosHandler); // Scenarios handles POST too
app.all('/api/submissions', submissionsHandler);

// Serve Static Files (The Frontend)
app.use(express.static(__dirname));

// Fallback for SPA (if needed, but we are just serving index.html)
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
🚀 Server running locally at http://localhost:${PORT}
✅ API Endpoints ready.
📂 Serving frontend from ${__dirname}
    `);
});
