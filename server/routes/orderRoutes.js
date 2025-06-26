import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateWithJoi } from '../middleware/validationMiddleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation.js';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  getAllOrders,
  deleteOrder
} from '../controllers/orderController.js';

router.use(protect);

router.post('/', validateWithJoi(createOrderSchema), createOrder);

router.get('/user', getUserOrders);


router.get('/admin', admin, getAllOrders);

router.get('/:id', getOrderById);

router.put('/:id', admin, validateWithJoi(updateOrderStatusSchema), updateOrderStatus);

router.delete('/:id', admin, deleteOrder);

export default router;
