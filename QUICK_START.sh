#!/bin/bash
# ProcastiNo - Quick Start Commands
# Copy & paste these commands into your terminal

# ========================================
# STEP 1: Navigate to project directory
# ========================================
cd "C:\Users\25eg1\OneDrive\Desktop\hackathon"


# ========================================
# STEP 2: Install dependencies (run once)
# ========================================
npm install


# ========================================
# STEP 3: Start the server
# ========================================
npm start

# Or use:
# node server.js


# ========================================
# Server will be running at:
# ========================================
# http://localhost:3000          (Landing Page)
# http://localhost:3000/dashboard (Dashboard)
# http://localhost:3000/api/health (Health Check)


# ========================================
# To stop the server:
# ========================================
# Press: Ctrl + C


# ========================================
# If port 3000 is in use (alternative):
# ========================================
# PORT=5000 npm start
# Then access: http://localhost:5000


# ========================================
# Troubleshooting:
# ========================================

# Check Node.js is installed:
node --version
npm --version

# Reinstall dependencies:
rmdir /s /q node_modules
npm install

# View server logs:
# (It prints to console when running with npm start)
