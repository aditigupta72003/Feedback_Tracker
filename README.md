# 📝 Feedback Tracker

A simple and intuitive full-stack feedback management system built using **React**, **Tailwind CSS**, and **Node.js + Express**.

---

## 📦 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: Local JSON file (`backend/server/data/feedback.json`)

---

## 🚀 How to Run the Project Locally

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)

---

### ⚙️ Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/adifiqupta72003/Feedback_Tracker.git
cd Feedback_Tracker


#### 2. Backend
cd backend
npm install
node server.js
```
The backend will start at:
📍 http://localhost:3001

Available API Endpoints:
GET /feedback – Get all feedback items

POST /feedback – Add new feedback

PUT /feedback/:id/vote – Upvote or downvote a feedback item

DELETE /feedback/:id – Delete a feedback item

GET /health – Health check endpoint

📂 Feedback data is stored in:
backend/server/data/feedback.json


#### 3. Frontend
Open a new terminal:

cd frontend
npm install
npm run dev
