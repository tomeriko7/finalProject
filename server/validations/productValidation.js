// validations/productValidation.js
import Joi from 'joi';

// סכמת ולידציה ליצירת מוצר חדש
export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'שם המוצר חייב להיות לפחות 2 תווים',
      'string.max': 'שם המוצר יכול להיות עד 100 תווים',
      'any.required': 'שם המוצר הוא שדה חובה'
    }),
    
  description: Joi.string().min(10).max(5000).required()
    .messages({
      'string.min': 'תיאור המוצר חייב להיות לפחות 10 תווים',
      'string.max': 'תיאור המוצר יכול להיות עד 5000 תווים',
      'any.required': 'תיאור המוצר הוא שדה חובה'
    }),
    
  price: Joi.number().min(0).required()
    .messages({
      'number.base': 'מחיר חייב להיות מספר',
      'number.min': 'מחיר לא יכול להיות שלילי',
      'any.required': 'מחיר הוא שדה חובה'
    }),
    
  category: Joi.string().required()
    .messages({
      'any.required': 'קטגוריה היא שדה חובה'
    }),
    
  stockQuantity: Joi.number().min(0).default(0)
    .messages({
      'number.base': 'כמות מלאי חייבת להיות מספר',
      'number.min': 'כמות מלאי לא יכולה להיות שלילית'
    }),
    
  imageUrl: Joi.string().allow('', null),
    
  isActive: Joi.boolean().default(true),
    
  discount: Joi.number().min(0).max(100).default(0)
    .messages({
      'number.base': 'הנחה חייבת להיות מספר',
      'number.min': 'הנחה לא יכולה להיות שלילית',
      'number.max': 'הנחה לא יכולה להיות יותר מ-100 אחוז'
    }),
    
  tags: Joi.array().items(Joi.string()).default([])
});

// סכמת ולידציה לעדכון מוצר קיים
export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100)
    .messages({
      'string.min': 'שם המוצר חייב להיות לפחות 2 תווים',
      'string.max': 'שם המוצר יכול להיות עד 100 תווים'
    }),
    
  description: Joi.string().min(10).max(5000)
    .messages({
      'string.min': 'תיאור המוצר חייב להיות לפחות 10 תווים',
      'string.max': 'תיאור המוצר יכול להיות עד 5000 תווים'
    }),
    
  price: Joi.number().min(0)
    .messages({
      'number.base': 'מחיר חייב להיות מספר',
      'number.min': 'מחיר לא יכול להיות שלילי'
    }),
    
  category: Joi.string(),
    
  stockQuantity: Joi.number().min(0)
    .messages({
      'number.base': 'כמות מלאי חייבת להיות מספר',
      'number.min': 'כמות מלאי לא יכולה להיות שלילית'
    }),
    
  imageUrl: Joi.string().allow('', null),
    
  isActive: Joi.boolean(),
    
  discount: Joi.number().min(0).max(100)
    .messages({
      'number.base': 'הנחה חייבת להיות מספר',
      'number.min': 'הנחה לא יכולה להיות שלילית',
      'number.max': 'הנחה לא יכולה להיות יותר מ-100 אחוז'
    }),
    
  tags: Joi.array().items(Joi.string())
});

// סכמת ולידציה לעדכון מלאי מוצר
export const updateStockSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'כמות חייבת להיות מספר',
      'number.integer': 'כמות חייבת להיות מספר שלם',
      'number.min': 'כמות חייבת להיות לפחות 1',
      'any.required': 'כמות היא שדה חובה'
    }),
    
  operation: Joi.string().valid('add', 'subtract').default('add')
    .messages({
      'string.valid': 'פעולה חייבת להיות "add" או "subtract"'
    })
});

// סכמת ולידציה להוספת ביקורת על מוצר
export const productReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required()
    .messages({
      'number.base': 'דירוג חייב להיות מספר',
      'number.min': 'דירוג חייב להיות לפחות 1',
      'number.max': 'דירוג יכול להיות מקסימום 5',
      'any.required': 'דירוג הוא שדה חובה'
    }),
    
  comment: Joi.string().min(3).max(1000).required()
    .messages({
      'string.min': 'התגובה חייבת להיות לפחות 3 תווים',
      'string.max': 'התגובה יכולה להיות עד 1000 תווים',
      'any.required': 'תגובה היא שדה חובה'
    })
});
