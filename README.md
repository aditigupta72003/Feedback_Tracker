Feedback Tracker
A simple full-stack feedback management system built using React, Tailwind CSS, and Node.js + Express.

How to Run the Project Locally
Prerequisites
Node.js (v14 or higher recommended)
Git

Installation & Setup

1. Clone the Repository

git clone https://github.com/aditigupta72003/Feedback_Tracker.git
cd Feedback_Tracker

2. Start the Backend Server

cd backend
npm install
node server.js
Starts on http://localhost:3001

API Endpoints:
GET /feedback
POST /feedback
PUT /feedback/:id/vote
DELETE /feedback/:id
GET /health

Feedback data is stored in backend/server/data/feedback.json

3. Start the Frontend React App

cd frontend
npm install
npm start
Runs on http://localhost:3000

For local development:

const API_BASE_URL = "http://localhost:3001";
