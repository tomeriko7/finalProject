// middleware/userFieldsMiddleware.js
import { initializeUserFields } from "../utils/userMigration.js";
import logger from "../utils/logger.js";

/**
 * Middleware to ensure user has all required fields initialized
 * This is used to ensure backward compatibility for existing users
 */
export const ensureUserFields = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      // Initialize missing fields for the authenticated user
      await initializeUserFields(req.user.id);
    }
    next();
  } catch (error) {
    logger.error("Error in ensureUserFields middleware:", {
      userId: req.user?.id,
      error: error.message,
    });
    // Don't block the request if field initialization fails
    // Log the error and continue
    next();
  }
};
