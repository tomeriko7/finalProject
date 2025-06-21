// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Flower Shop API!',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile',
      updateProfile: 'PUT /api/auth/profile',
      changePassword: 'PUT /api/auth/change-password',
      logout: 'POST /api/auth/logout',
      verifyToken: 'GET /api/auth/verify-token',
      forgotPassword: 'POST /api/auth/forgot-password'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'PUT /api/auth/profile',
      'PUT /api/auth/change-password',
      'POST /api/auth/logout',
      'GET /api/auth/verify-token',
      'POST /api/auth/forgot-password'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});