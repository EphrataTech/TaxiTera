# TaxiTera - Server Startup Guide

## Quick Start

### 1. Install Dependencies
```bash
# Backend
cd server
npm install nodemailer @nestjs/websockets @nestjs/platform-socket.io socket.io stripe helmet

# Frontend  
cd ../client
npm install socket.io-client
```

### 2. Start Backend Server
```bash
cd server
npm run start:dev
```
**Expected output:** `🚀 Server running on http://localhost:5000`

### 3. Start Frontend Server
```bash
cd client
npm run dev
```
**Expected output:** `Ready - started server on 0.0.0.0:3000`

## Troubleshooting

### "Failed to fetch" Error
- ✅ Backend server must be running on port 5000
- ✅ MongoDB must be running on port 27017
- ✅ Check CORS configuration in main.ts

### Test Backend Connection
Visit: http://localhost:5000/health
Should return: `{"status":"ok","timestamp":"...","service":"TaxiTera API"}`

### Environment Variables
Update `server/.env` with your actual email credentials:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```