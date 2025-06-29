// config/database.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flower-shop', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB - Connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB - Connection error:', {
        error: err.message,
        stack: err.stack
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB - Connection disconnected');
    });

  } catch (error) {
    logger.error('Error connecting to MongoDB:', {
      error: error.message,
      stack: error.stack,
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flower-shop'
    });
    process.exit(1);
  }
};

export default connectDB;