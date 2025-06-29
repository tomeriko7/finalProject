// validations/cartValidation.js
import { body, param } from 'express-validator';

export const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('מזהה מוצר לא תקין'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('הכמות חייבת להיות מספר שלם חיובי')
];

export const updateCartQuantityValidation = [
  param('cartItemId')
    .isMongoId()
    .withMessage('מזהה פריט בסל לא תקין'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('הכמות חייבת להיות מספר שלם חיובי')
];

export const removeFromCartValidation = [
  param('cartItemId')
    .isMongoId()
    .withMessage('מזהה פריט בסל לא תקין')
];

export const syncCartValidation = [
  body('cartItems')
    .isArray()
    .withMessage('פריטי הסל חייבים להיות מערך'),
  body('cartItems.*.productId')
    .isMongoId()
    .withMessage('מזהה מוצר לא תקין'),
  body('cartItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('הכמות חייבת להיות מספר שלם חיובי')
];
