# ProcastiNo - Backend Setup Guide

## 🚀 Quick Start

Your ProcastiNo application now has a secure Node.js Express backend! The API key is now protected in the `.env` file instead of being exposed in client-side code.

---

## 📋 Prerequisites

Make sure you have **Node.js** installed on your system.

**Check if Node.js is installed:**
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/ (LTS version recommended)

---

## 🔧 Installation & Setup

### Step 1: Navigate to your project directory
```bash
cd "C:\Users\25eg1\OneDrive\Desktop\hackathon"
```

### Step 2: Install dependencies
```bash
npm install
```

This will install:
- **Express** - Web framework for Node.js
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

Expected output:
```
added 50 packages in 3s
```

---

## ▶️ Running the Server

### Basic startup (Development):
```bash
npm start
```

Or directly:
```bash
node server.js
```

You should see:
```
╔════════════════════════════════════════╗
║        ProcastiNo Server Started       ║
╠════════════════════════════════════════╣
║  Server:  http://localhost:3000        ║
║  API:     http://localhost:3000/api   ║
║  Status:  ✓ Running                    ║
╚════════════════════════════════════════╝

Open http://localhost:3000 in your browser
```

---

## 🌐 Access Your App

Once the server is running:

- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **API Health Check**: http://localhost:3000/api/health

---

## 📡 API Endpoints

### 1. Chat Endpoint (AI Assistant)
**POST** `/api/chat`

Request:
```json
{
  "message": "Break down creating a research paper into steps"
}
```

Response:
```json
{
  "success": true,
  "message": "1. [ ] Research topic...\n2. [ ] Create outline..."
}
```

### 2. Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-28T10:30:00.000Z"
}
```

---

## 🔐 Security Features

✅ **API Key Protection**
- Your Gemini API key is stored in `.env` (not exposed in code)
- Only the backend server can access it
- Never sent to the client

✅ **CORS Enabled**
- Secure cross-origin requests

✅ **Input Validation**
- All API requests are validated

---

## 🛑 Stopping the Server

In your terminal, press:
```bash
Ctrl + C
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
If you get "Port 3000 is already in use", run on a different port:
```bash
PORT=5000 npm start
```

Then access: http://localhost:5000

### Module not found errors
Delete `node_modules` and reinstall:
```bash
rmdir /s /q node_modules
npm install
```

### Cannot find Gemini API key
Make sure your `.env` file exists in the project root with:
```
GEMINI_API_KEY=your_api_key_here
```

### Checklist/Schedule not saving
Currently, data is stored in browser localStorage. To add database persistence:
- Install MongoDB/PostgreSQL
- Create database endpoints in `server.js`
- Update frontend to sync with backend

---

## 📦 Project Structure

```
hackathon/
├── server.js                 # Express backend server
├── package.json             # Node.js dependencies
├── .env                     # Environment variables (API key)
├── .gitignore              # Git ignore rules
├── index.html              # Landing page
├── dashboard.html          # Main dashboard
├── styles.css              # All CSS styling
└── script.js               # Frontend JavaScript (updated)
```

---

## 🚀 Next Steps

### Option 1: Deploy to the Cloud
Services like Heroku, Vercel, or Railway can host your server:
```bash
# Example with Railway (free tier available)
railway up
```

### Option 2: Add Database
For persistent data storage:
```bash
npm install mongoose  # For MongoDB
# or
npm install pg        # For PostgreSQL
```

### Option 3: Add Authentication
For user accounts and data:
```bash
npm install bcryptjs jsonwebtoken
```

---

## 📝 Environment Variables

Your `.env` file currently contains:
```
GEMINI_API_KEY=AIzaSyAQHD4p9SCbRIw4VhEEB8OUB18NfnzkNDQ
```

**Optional variables you can add:**
```
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # development/production
DATABASE_URL=mongodb://...   # Database connection (future)
```

---

## ✅ What's New

### Before (Client-side API key)
```javascript
// ❌ Unsafe - API key exposed in browser
const GEMINI_API_KEY = 'AIzaSyAQHD4p9SCbRIw4VhEEB8OUB18NfnzkNDQ';
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, ...);
```

### After (Server-side API key)
```javascript
// ✅ Safe - API key protected on server
const response = await fetch('/api/chat', {
  body: JSON.stringify({ message: userInput })
});
// Server handles Gemini API internally
```

---

## 📞 Support

If you encounter issues:
1. Check that Node.js is installed: `node --version`
2. Verify `.env` file exists with API key
3. Check that port 3000 is not blocked by firewall
4. Look at console errors: they appear in terminal where you ran `npm start`

---

## 🎉 You're All Set!

Your ProcastiNo backend is now:
- ✅ Secure (API key protected)
- ✅ Scalable (Express server)
- ✅ Ready for production (with minor tweaks)
- ✅ Easy to maintain (clean code structure)

Happy coding! 🚀
