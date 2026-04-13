# Violet Tracker

A modern web-based application built to track activities, meals, and medical events via a glassmorphic aesthetic Timeline.

## Stack
- **Frontend**: React + Vite + Vanilla CSS
- **Backend**: Node.js + Express.js + SQLite3

## How to Run

1. **Backend**:
```bash
cd backend
npm install
node server.js
```
*(Runs on localhost:3001 by default)*

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

Data is stored persistently without setup via a local `data.db` SQLite database in the `/backend` folder.
