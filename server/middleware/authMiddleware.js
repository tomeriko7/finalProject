import { verifyToken } from "../utils/generateToken.js";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token); // שימוש בפונקציה עם issuer/audience
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Token verification failed", {
      error: error.message,
      token: token ? 'present' : 'missing',
      stack: error.stack
    });
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Admin middleware - checks if user is admin
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }

  next();
};

// Optional auth middleware - works with or without token
const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue without user
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Invalid token, but continue without user
    console.log("Optional auth failed:", error.message);
  }

  next();
};

export default authMiddleware;
export { authMiddleware as protect, adminMiddleware as admin, optionalAuthMiddleware as optionalAuth };
