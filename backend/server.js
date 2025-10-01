const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Added bcrypt for password hashing
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/users');
const smsRoutes = require('./routes/sms');
const User = require('./models/User'); // Import the User model

const app = express();

// Middleware
// This is the "Guest List". It now includes your official frontend domain and localhost for development.
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow localhost with any port for dev
        if (origin.startsWith('http://localhost:')) return callback(null, true);
        // Allow production domain
        if (origin === 'https://tagro.vercel.app') return callback(null, true);
        if (origin === 'http://localhost:5174') return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.get('/', (req, res) => {
    res.send('Welcome to the T Agro API! It is running.');
});
app.use('/api/users', userRoutes);
app.use('/api/sms', smsRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // After connecting to MongoDB, check for an admin user and create one if it doesn't exist
        createAdminUser();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Function to create the admin user
async function createAdminUser() {
    try {
        // Check if an admin user already exists
        let adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            // Admin user doesn't exist, create one
            const adminUsername = process.env.ADMIN_USERNAME || 'admin';
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'password';
            const adminPhone = process.env.ADMIN_PHONE || '01234567890';
            const adminId = process.env.ADMIN_ID || 'admin123';

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(adminPassword, salt);

            // Create the new admin user
            adminUser = new User({
                id: adminId,
                name: adminUsername,
                email: adminEmail,
                phone: adminPhone,
                passwordHash: passwordHash,
                role: 'admin'
            });

            // Save the new admin user to the database
            await adminUser.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
