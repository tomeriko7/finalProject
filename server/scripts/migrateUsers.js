// scripts/migrateUsers.js
import mongoose from "mongoose";
import { migrateAllUsers } from "../utils/userMigration.js";
import logger from "../utils/logger.js";

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/flower-shop"
    );
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Database connection failed:", {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Main migration function
const runMigration = async () => {
  try {
    logger.info("Starting user migration process...");

    // Connect to database
    await connectDB();

    // Run migration
    const result = await migrateAllUsers();

    logger.info("Migration completed successfully!", {
      totalProcessed: result.totalProcessed,
      successCount: result.successCount,
      errorCount: result.errorCount
    });
  } catch (error) {
    logger.error("Migration failed:", {
      error: error.message,
      stack: error.stack
    });
  } finally {
    // Close database connection
    await mongoose.connection.close();
    logger.info("Database connection closed");
    process.exit(0);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Run the migration
runMigration();
