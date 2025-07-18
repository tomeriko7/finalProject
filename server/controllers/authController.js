// controllers/authController.js
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import { safeMongooseSave } from "../middleware/validationMiddleware.js";
import { validationResult } from "express-validator";
import { initializeUserFields } from "../utils/userMigration.js";

// Register new user
const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      dateOfBirth,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      dateOfBirth,
    });

    // Use safeMongooseSave to validate and save the user
    const savedUser = await safeMongooseSave(user, res, "User registration");
    if (!savedUser) return; // Error response already sent by safeMongooseSave

    logger.info("New user registered", {
      userId: savedUser._id,
      email: savedUser.email,
    });

    // Generate token
    const token = generateToken(savedUser._id);

    // Update last login
    await savedUser.updateLastLogin();

    res.status(201).json({
      success: true,
      message: "המשתמש נרשם והתחבר בהצלחה",
      token,
      autoLogin: true, // סימון שזו התחברות אוטומטית
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        fullName: savedUser.fullName,
        email: savedUser.email,
        phone: savedUser.phone,
        address: savedUser.address,
        isAdmin: savedUser.isAdmin,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    logger.error("User registration failed", {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
    });

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // Handle MongoDB validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Initialize missing fields for backward compatibility
    await initializeUserFields(user._id);

    // Update last login
    await user.updateLastLogin();

    // Fetch updated user data with all fields
    const updatedUser = await User.findById(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
        lastLogin: updatedUser.lastLogin,
        preferences: updatedUser.preferences || {
          newsletter: true,
          smsNotifications: false,
        },
      },
    });
  } catch (error) {
    logger.error("User login failed", {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
    });
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // Initialize missing fields for backward compatibility
    await initializeUserFields(req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin,
        preferences: user.preferences || {
          newsletter: true,
          smsNotifications: false,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Profile fetch error", {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const updates = {};

    // Basic validation is handled by Joi validation middleware
    for (const key in req.body) {
      if (
        ["firstName", "lastName", "phone", "address", "dateOfBirth"].includes(
          key
        )
      ) {
        updates[key] = req.body[key];
      }
    }

    // Get current user
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    Object.assign(user, updates);

    // Use safeMongooseSave to validate and save the user
    const updatedUser = await safeMongooseSave(user, res, "Profile update");
    if (!updatedUser) return; // Error response already sent by safeMongooseSave

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Update profile error", {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });
    res.status(500).json({
      success: false,
      message: "Server error during profile update",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is different from current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Update password
    user.password = newPassword;

    // Use safeMongooseSave to validate and save the user
    const updatedUser = await safeMongooseSave(user, res, "Password change");
    if (!updatedUser) return; // Error response already sent by safeMongooseSave

    logger.info("User password changed", {
      userId: updatedUser._id,
      email: updatedUser.email,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password error", {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });
    res.status(500).json({
      success: false,
      message: "Server error during password change",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Logout user (optional - mainly for token invalidation on client side)
const logout = async (req, res) => {
  try {
    // In JWT, logout is typically handled on the client side by removing the token
    // But we can log this for security/audit purposes
    logger.info("User logged out", {
      userId: req.user.id,
      email: req.user.email,
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("Logout error", {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Forgot password (placeholder - would typically send email)
const forgotPassword = async (req, res) => {
  try {
    // Add schema validation for email
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "נדרשת כתובת אימייל",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Here you would typically:
    // 1. Generate a reset token
    // 2. Save it to database with expiration
    // 3. Send email with reset link

    logger.info("Password reset requested", { email });

    res.json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    logger.error("Forgot password error", {
      error: error.message,
      stack: error.stack,
      email: req.body.email,
    });
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// Verify token (useful for checking if user is still authenticated)
const verifyToken = async (req, res) => {
  try {
    // If we reach here, the token is valid (middleware already verified it)
    const user = await User.findById(req.user.id);

    logger.debug("Token verification", {
      userId: req.user.id,
      valid: Boolean(user && user.isActive),
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    res.json({
      success: true,
      message: "Token is valid",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    logger.error("Verify token error", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  verifyToken,
};
