const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();

// --- START: UPDATED CORS CONFIGURATION ---

// This is the "Guest List". It now includes your official frontend domain.
const corsOptions = {
  origin: 'https://tagro.vercel.app' 
};

// Use the updated guest list.
app.use(cors(corsOptions));

// --- END: UPDATED CORS CONFIGURATION ---


// Middleware
app.use(express.json());

// A welcome message for the root URL (optional, but good for testing)
app.get('/', (req, res) => {
  res.send('Welcome to the Tagro API!');
});

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
