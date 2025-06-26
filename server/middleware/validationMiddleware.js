// middleware/validationMiddleware.js
import Joi from 'joi';
import logger from '../utils/logger.js';

/**
 * Validates request body against given Joi schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateWithJoi = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      logger.warn('Validation error', {
        path: req.path,
        errors: error.details.map(detail => detail.message),
        body: req.body
      });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.context.key,
          message: detail.message
        }))
      });
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

/**
 * Safe mongoose save - handles validation errors from mongoose
 * @param {Model} model - Mongoose model instance to save
 * @param {Response} res - Express response object
 * @param {String} errorPrefix - Prefix for error messages
 * @returns {Promise} - Promise resolving to saved document or null if error
 */
export const safeMongooseSave = async (model, res, errorPrefix = 'Error') => {
  try {
    // Pre-validate the model before saving
    const validationError = model.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      logger.warn('Mongoose validation error', {
        model: model.constructor.modelName,
        errors: errors
      });

      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
      return null;
    }

    // If validation passes, save the document
    const savedDoc = await model.save();
    return savedDoc;

  } catch (error) {
    logger.error(`${errorPrefix} save error`, { 
      error: error.message, 
      stack: error.stack,
      model: model.constructor.modelName
    });

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
      return null;
    }

    // Handle MongoDB validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors
      });
      return null;
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: `Server error during ${errorPrefix.toLowerCase()}`,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
    return null;
  }
};
