// utils/userMigration.js
import User from "../models/User.js";
import logger from "./logger.js";

/**
 * Initialize missing fields for existing users
 * This ensures backward compatibility when new fields are added to the User model
 */
export const initializeUserFields = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    let hasChanges = false;

    // Initialize preferences if missing
    if (!user.preferences) {
      user.preferences = {
        newsletter: true,
        smsNotifications: false,
      };
      hasChanges = true;
      logger.info(`Initializing preferences for user ${userId}`);
    }

    // Initialize favorites array if missing
    if (!user.favorites) {
      user.favorites = [];
      hasChanges = true;
      logger.info(`Initializing favorites array for user ${userId}`);
    }

    // Initialize cart array if missing
    if (!user.cart) {
      user.cart = [];
      hasChanges = true;
      logger.info(`Initializing cart array for user ${userId}`);
    }

    // Save changes if any were made
    if (hasChanges) {
      await user.save();
      logger.info(`User fields initialized successfully for user ${userId}`);
    }

    return user;
  } catch (error) {
    logger.error("Error initializing user fields:", {
      userId,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Batch migration for all existing users
 * Run this once to update all existing users in the database
 */
export const migrateAllUsers = async () => {
  try {
    logger.info("Starting user migration for missing fields...");

    // Find all users that might need field initialization
    const users = await User.find({
      $or: [
        { preferences: { $exists: false } },
        { favorites: { $exists: false } },
        { cart: { $exists: false } },
      ],
    });

    logger.info(`Found ${users.length} users that need field initialization`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        await initializeUserFields(user._id);
        successCount++;
      } catch (error) {
        errorCount++;
        logger.error(
          `Failed to initialize fields for user ${user._id}:`,
          error.message
        );
      }
    }

    logger.info(
      `User migration completed. Success: ${successCount}, Errors: ${errorCount}`
    );

    return {
      totalProcessed: users.length,
      successCount,
      errorCount,
    };
  } catch (error) {
    logger.error("Error during user migration:", error);
    throw error;
  }
};
