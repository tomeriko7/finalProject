// routes/favoriteRoutes.js
import express from "express";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
} from "../controllers/favoriteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { ensureUserFields } from "../middleware/userFieldsMiddleware.js";
import {
  addToFavoritesValidation,
  removeFromFavoritesValidation,
  toggleFavoriteValidation
} from '../validations/favoriteValidation.js';

const router = express.Router();

// כל הראוטים דורשים אימות וודא שהשדות קיימים
router.use(authMiddleware);
router.use(ensureUserFields);

// GET /api/favorites - קבלת רשימת המועדפים
router.get("/", getFavorites);

// POST /api/favorites - הוספת מוצר למועדפים
router.post("/", addToFavoritesValidation, addToFavorites);

// DELETE /api/favorites/:productId - הסרת מוצר מהמועדפים
router.delete("/:productId", removeFromFavoritesValidation, removeFromFavorites);

// PUT /api/favorites/toggle - החלפת סטטוס מועדפים
router.put("/toggle", toggleFavoriteValidation, toggleFavorite);

// DELETE /api/favorites - ניקוי כל המועדפים
router.delete("/", clearFavorites);

export default router;
