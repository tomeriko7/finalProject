// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import logger from './utils/logger.js';

dotenv.config();

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Dynamic import for auth routes to handle path issues
  const authModule = await import('./routes/authRoutes.js');
  const authRoutes = authModule.default;
  
  // Dynamic import for order routes
  const orderModule = await import('./routes/orderRoutes.js');
  const orderRoutes = orderModule.default;
  
  // Dynamic import for admin routes
  const adminModule = await import('./routes/adminRoutes.js');
  const adminRoutes = adminModule.default;

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Connect to MongoDB
  try {
    await connectDB();
    logger.info('MongoDB connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', { error: error.message });
    process.exit(1);
  }

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  
  // Request logging middleware
  app.use((req, res, next) => {
    logger.debug('Incoming request', { 
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // Log response time
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const level = res.statusCode >= 400 ? 'warn' : 'debug';
      logger[level]('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    });
    next();
  });

  // Enable CORS
  const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );
  logger.info('CORS enabled', { origin: corsOrigin });

  // Set security headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  
  logger.info('Routes registered', {
    routes: [
      '/api/auth',
      '/api/products',
      '/api/upload',
      '/api/orders',
      '/api/admin'
    ]
  });

  // Make uploads folder static
  const uploadsDir = path.join(__dirname, 'uploads');
  app.use('/uploads', express.static(uploadsDir));

// Welcome route
app.get('/', (req, res) => {
  logger.info('Welcome route accessed', { ip: req.ip });
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
      forgotPassword: 'POST /api/auth/forgot-password',
      products: {
        getProducts: 'GET /api/products',
        getProduct: 'GET /api/products/:id',
        createProduct: 'POST /api/products',
        updateProduct: 'PUT /api/products/:id',
        deleteProduct: 'DELETE /api/products/:id'
      }
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  logger.debug('Health check requested', { ip: req.ip });
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error', { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0],
    });
  }

  // Default error handler
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', { 
    path: req.originalUrl, 
    method: req.method, 
    ip: req.ip 
  });
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
    logger.info(`Server started successfully`, {
      port: PORT,
      url: `http://localhost:${PORT}`,
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// Start the server
startServer().catch(error => {
  logger.error('Failed to start server', { error: error.message, stack: error.stack });
  process.exit(1);
});
