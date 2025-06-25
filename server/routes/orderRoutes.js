import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  getAllOrders,
  deleteOrder
} from '../controllers/orderController.js';

router.use(protect);

router.post('/', createOrder);

router.get('/user', getUserOrders);


router.get('/admin', admin, getAllOrders);

router.get('/:id', getOrderById);

router.put('/:id', admin, updateOrderStatus);

router.delete('/:id', admin, deleteOrder);

export default router;
