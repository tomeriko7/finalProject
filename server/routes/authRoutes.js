// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  forgotPassword,
  verifyToken
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import { validateWithJoi } from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validations/userValidation.js';

const router = express.Router();

// Public routes
router.post('/register', validateWithJoi(registerSchema), register);
router.post('/login', validateWithJoi(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, validateWithJoi(updateProfileSchema), updateProfile);
router.post('/change-password', authMiddleware, validateWithJoi(changePasswordSchema), changePassword);

export default router;