import express from 'express';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  updateProductStock,
} from '../controllers/productController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/:id/reviews', protect, createProductReview);

// Admin routes (require admin privileges)
// Product creation route with proper multer configuration
router.post(
  '/', 
  protect, 
  admin, 
  upload.single('image'),
  (req, res, next) => {
    // Debug log the incoming request
    console.log('Request received at /api/products POST endpoint');
    console.log('Content-Type:', req.headers['content-type']);
    next();
  },
  
  createProduct
);

router.put(
  '/:id', 
  protect, 
  admin, 
  upload.single('image'), 
  updateProduct
);

router.put(
  '/:id/stock',
  protect,
  admin,
  updateProductStock
);

router.delete(
  '/:id', 
  protect, 
  admin, 
  deleteProduct
);

// Optional authentication routes (works with or without auth)
router.get('/featured', optionalAuth, getProducts);

export default router;
