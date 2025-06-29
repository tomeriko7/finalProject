// routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  syncCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { ensureUserFields } from "../middleware/userFieldsMiddleware.js";
import {
  addToCartValidation,
  updateCartQuantityValidation,
  removeFromCartValidation,
  syncCartValidation
} from '../validations/cartValidation.js';

const router = express.Router();

// כל הראוטים דורשים אימות וודא שהשדות קיימים
router.use(authMiddleware);
router.use(ensureUserFields);

// GET /api/cart - קבלת סל הקניות
router.get("/", getCart);

// POST /api/cart - הוספת מוצר לסל הקניות
router.post("/", addToCartValidation, addToCart);

// PUT /api/cart/:cartItemId - עדכון כמות מוצר בסל
router.put("/:cartItemId", updateCartQuantityValidation, updateCartQuantity);

// DELETE /api/cart/:cartItemId - הסרת מוצר מסל הקניות
router.delete("/:cartItemId", removeFromCartValidation, removeFromCart);

// DELETE /api/cart - ניקוי כל סל הקניות
router.delete("/", clearCart);

// POST /api/cart/sync - סנכרון סל קניות מהלקוח
router.post("/sync", syncCartValidation, syncCart);

export default router;
