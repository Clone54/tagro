const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();

// --- START: CORRECT CORS CONFIGURATION ---
// This tells your backend that ONLY your frontend is allowed to make requests.
const corsOptions = {
  origin: 'https://tagro-hffoh8ryg-firoz-ahmeds-projects-54758561.vercel.app',
  optionsSuccessStatus: 200 // For legacy browser support
};

// Use the CORS middleware with the specific options
app.use(cors(corsOptions));
// --- END: CORRECT CORS CONFIGURATION ---


// Middleware
// The express.json() middleware should come after CORS is configured.
app.use(express.json());


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
