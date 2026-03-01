require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve dashboard.html for /dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// ===== API Routes =====

/**
 * POST /api/chat
 * Sends user message to Groq API and returns response
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid message format. Please provide a non-empty string.'
            });
        }

        // Validate API key exists
        if (!process.env.GROQ_API_KEY) {
            console.error('❌ GROQ_API_KEY not found in .env file');
            return res.status(500).json({
                error: 'API configuration error. Please contact administrator.',
                details: 'GROQ_API_KEY is not set in .env file'
            });
        }

        console.log(`✅ API Key found: ${process.env.GROQ_API_KEY.substring(0, 10)}...`);

        // Create system prompt
        const systemPrompt = `You are ProcastiNo, a friendly and encouraging AI study assistant for students. Your role is to:
1. Motivate students when they feel lazy or demotivated
2. Answer academic questions clearly and helpfully
3. Help break down large projects/tasks into smaller, manageable subtasks with a checklist format
4. Be empathetic, positive, and student-focused
5. Keep responses concise but helpful (unless asked for detailed explanations)

When a student asks for task breakdown, return it as a numbered checklist like:
1. [ ] First subtask
2. [ ] Second subtask
etc.

Be conversational, use emojis occasionally, and remember you're talking to a student who might be stressed or procrastinating.`;

        // Call Groq API
        console.log(`📡 Calling Groq API...`);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Groq API Error:', errorBody);
            return res.status(response.status).json({
                error: `API Error: ${response.status}`,
                details: errorBody
            });
        }

        const data = await response.json();
        console.log(`✅ Success with Groq!`);

        // Extract response text
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const assistantMessage = data.choices[0].message.content;
            return res.json({
                success: true,
                message: assistantMessage
            });
        } else {
            return res.status(500).json({
                error: 'Unexpected API response format',
                details: data
            });
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            error: 'Server error processing your request',
            message: error.message
        });
    }
});

/**
 * POST /api/save-data
 */
app.post('/api/save-data', (req, res) => {
    try {
        const { dataType, data } = req.body;
        if (!dataType || !data) {
            return res.status(400).json({ error: 'Invalid request format' });
        }
        console.log(`Data saved: ${dataType}`, data);
        res.json({ success: true, message: `${dataType} saved successfully` });
    } catch (error) {
        console.error('Save Data Error:', error);
        res.status(500).json({ error: 'Failed to save data', message: error.message });
    }
});

/**
 * GET /api/load-data
 */
app.get('/api/load-data/:dataType', (req, res) => {
    try {
        const { dataType } = req.params;
        res.json({ success: true, dataType: dataType, data: [] });
    } catch (error) {
        console.error('Load Data Error:', error);
        res.status(500).json({ error: 'Failed to load data', message: error.message });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    const apiKey = process.env.GROQ_API_KEY;
    const keyStatus = apiKey ? `✅ Loaded (${apiKey.substring(0, 10)}...)` : '❌ NOT FOUND';

    console.log(`
╔════════════════════════════════════════╗
║        ProcastiNo Server Started       ║
╠════════════════════════════════════════╣
║  Server:  http://localhost:${PORT}         ║
║  API:     http://localhost:${PORT}/api   ║
║  Status:  ✓ Running                     ║
║  API Key: ${keyStatus}
╚════════════════════════════════════════╝
    `);
    console.log(`Open http://localhost:${PORT} in your browser`);
    });