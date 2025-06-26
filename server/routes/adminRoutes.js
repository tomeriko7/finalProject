import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getDashboardStats, getRecentUsers, getRecentOrders, getSalesStats } from '../controllers/adminController.js';

const router = express.Router();

// נתיב לקבלת נתוני לוח הבקרה
router.get('/dashboard', protect, admin, getDashboardStats);

// נתיב לקבלת משתמשים אחרונים
router.get('/users', protect, admin, getRecentUsers);

// נתיב לקבלת הזמנות אחרונות
router.get('/orders', protect, admin, getRecentOrders);

// נתיב לקבלת נתוני מכירות
router.get('/sales', protect, admin, getSalesStats);

export default router;
