// validations/favoriteValidation.js
import { body, param } from "express-validator";

export const addToFavoritesValidation = [
  body("productId").isMongoId().withMessage("מזהה מוצר לא תקין"),
];

export const removeFromFavoritesValidation = [
  param("productId").isMongoId().withMessage("מזהה מוצר לא תקין"),
];

export const toggleFavoriteValidation = [
  body("productId").isMongoId().withMessage("מזהה מוצר לא תקין"),
];
