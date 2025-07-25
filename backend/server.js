const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'feedback.json');

// Enhanced CORS configuration
// app.use(cors({
//   origin: ['http://localhost:5174','http://localhost:3000', 'http://127.0.0.1:3000',],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read feedback from file
async function readFeedback() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing feedback file found, returning empty array');
    return [];
  }
}

// Write feedback to file
async function writeFeedback(feedback) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE, JSON.stringify(feedback, null, 2));
    console.log(`Successfully wrote ${feedback.length} feedback items to file`);
  } catch (error) {
    console.error('Error writing feedback to file:', error);
    throw error;
  }
}

// Routes

// GET /feedback - Get all feedback
app.get('/feedback', async (req, res) => {
  try {
    console.log(' Fetching all feedback...');
    const feedback = await readFeedback();
    console.log(` Retrieved ${feedback.length} feedback items`);
    res.json(feedback);
  } catch (error) {
    console.error(' Error reading feedback:', error);
    res.status(500).json({ error: 'Failed to read feedback' });
  }
});

// POST /feedback - Add new feedback
// POST /feedback - Add new feedback
app.post('/feedback', async (req, res) => {
  try {
    console.log(' Creating new feedback...');
    console.log(' Incoming request body:', req.body); // ✅ Debug log

    const { name, email, message } = req.body;

    // Enhanced validation
    if (!name || !email || !message) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }

    if (typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log(' Invalid email format');
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const newFeedback = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      votes: 0,
      createdAt: new Date().toISOString()
    };

    const feedback = await readFeedback();
    feedback.unshift(newFeedback);
    await writeFeedback(feedback);

    console.log(` Successfully created feedback with ID: ${newFeedback.id}`);
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error(' Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback. Please try again later.' });
  }
});


// PUT /feedback/:id/vote - Upvote or downvote
app.put('/feedback/:id/vote', async (req, res) => {
  try {
    console.log(` Processing vote for feedback ID: ${req.params.id}`);
    const { id } = req.params;
    const { action } = req.body;

    if (!action || !['upvote', 'downvote'].includes(action)) {
      console.log('Invalid vote action');
      return res.status(400).json({ error: 'Action must be "upvote" or "downvote"' });
    }

    const feedback = await readFeedback();
    const feedbackIndex = feedback.findIndex(item => item.id === id);

    if (feedbackIndex === -1) {
      console.log(' Feedback not found');
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const voteChange = action === 'upvote' ? 1 : -1;
    feedback[feedbackIndex].votes += voteChange;

    await writeFeedback(feedback);
    console.log(` Successfully ${action}d feedback. New vote count: ${feedback[feedbackIndex].votes}`);
    res.json(feedback[feedbackIndex]);
  } catch (error) {
    console.error('Error voting on feedback:', error);
    res.status(500).json({ error: 'Failed to vote on feedback' });
  }
});

// DELETE /feedback/:id - Delete feedback
app.delete('/feedback/:id', async (req, res) => {
  try {
    console.log(`🗑️ Deleting feedback ID: ${req.params.id}`);
    const { id } = req.params;
    const feedback = await readFeedback();
    const feedbackIndex = feedback.findIndex(item => item.id === id);

    if (feedbackIndex === -1) {
      console.log('Feedback not found');
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const deletedFeedback = feedback.splice(feedbackIndex, 1)[0];
    await writeFeedback(feedback);

    console.log(` Successfully deleted feedback: ${deletedFeedback.name}`);
    res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
  } catch (error) {
    console.error(' Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// GET /health - Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// GET /stats - Get basic statistics
app.get('/stats', async (req, res) => {
  try {
    const feedback = await readFeedback();
    const totalVotes = feedback.reduce((sum, item) => sum + item.votes, 0);
    const positiveVotes = feedback.filter(item => item.votes > 0).length;
    
    res.json({
      totalFeedback: feedback.length,
      totalVotes,
      averageVotes: feedback.length > 0 ? (totalVotes / feedback.length).toFixed(1) : '0.0',
      positiveRate: feedback.length > 0 ? ((positiveVotes / feedback.length) * 100).toFixed(0) : '0'
    });
  } catch (error) {
    console.error(' Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(' Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on our end!' });
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(' ======================================');
  console.log(' Feedback Tracker Pro API Server');
  console.log('======================================');
  console.log(` Server running on: http://localhost:${PORT}`);
  console.log(` Data storage: ${DATA_FILE}`);
  console.log(` Started at: ${new Date().toISOString()}`);
  console.log(' ======================================');
});