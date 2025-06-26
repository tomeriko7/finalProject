import winston from 'winston';
import { format } from 'winston';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom formats
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.level}]: ${info.message} ${info.metadata ? JSON.stringify(info.metadata) : ''}`)
);

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.level}]: ${info.message} ${info.metadata ? JSON.stringify(info.metadata) : ''}`)
);

// Custom log levels with mapping to standard levels
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  verbose: 4
};

// Create logger instance
const logger = winston.createLogger({
  levels: customLevels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata()
  ),
  defaultMeta: { service: 'api-service' },
  transports: [
    // Write logs to console
    new winston.transports.Console({ format: consoleFormat }),
    // Write all logs to combined.log file
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log'),
      format: fileFormat
    }),
    // Write error level logs to error.log file
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      format: fileFormat
    })
  ]
});

// Convenience methods wrapper for logging
const loggerWrapper = {
  error: (message, meta = {}) => logger.log('error', message, { metadata: meta }),
  warn: (message, meta = {}) => logger.log('warn', message, { metadata: meta }),
  info: (message, meta = {}) => logger.log('info', message, { metadata: meta }),
  debug: (message, meta = {}) => logger.log('debug', message, { metadata: meta }),
  verbose: (message, meta = {}) => logger.log('verbose', message, { metadata: meta }),
  
  // Log user actions
  userAction: (userId, action, details = {}) => {
    logger.log('info', `User ${userId} performed action: ${action}`, { userId, action, ...details });
  },
  
  // Log admin actions
  adminAction: (adminId, action, details = {}) => {
    logger.log('info', `Admin ${adminId} performed action: ${action}`, { adminId, action, ...details });
  },
  
  // Log order status changes
  orderStatus: (orderId, prevStatus, newStatus, userId) => {
    logger.log('info', `Order ${orderId} status changed from ${prevStatus} to ${newStatus}`, 
      { orderId, prevStatus, newStatus, userId });
  }
};

export default loggerWrapper;