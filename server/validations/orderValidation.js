// validations/orderValidation.js
import Joi from 'joi';

// סכמת ולידציה ליצירת הזמנה חדשה
export const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required()
        .messages({
          'any.required': 'מזהה המוצר הוא שדה חובה'
        }),
      name: Joi.string().required()
        .messages({
          'any.required': 'שם המוצר הוא שדה חובה'
        }),
      price: Joi.number().min(0).required()
        .messages({
          'number.base': 'מחיר חייב להיות מספר',
          'number.min': 'מחיר לא יכול להיות שלילי',
          'any.required': 'מחיר הוא שדה חובה'
        }),
      quantity: Joi.number().integer().min(1).required()
        .messages({
          'number.base': 'כמות חייבת להיות מספר',
          'number.integer': 'כמות חייבת להיות מספר שלם',
          'number.min': 'כמות חייבת להיות לפחות 1',
          'any.required': 'כמות היא שדה חובה'
        }),
      imageUrl: Joi.string().allow('', null)
    })
  ).min(1).required()
    .messages({
      'array.min': 'ההזמנה חייבת לכלול לפחות פריט אחד',
      'any.required': 'פריטים הם שדה חובה'
    }),
  
  contactInfo: Joi.object({
    firstName: Joi.string().min(2).max(50).required()
      .messages({
        'string.min': 'שם פרטי חייב להיות לפחות 2 תווים',
        'string.max': 'שם פרטי יכול להיות עד 50 תווים',
        'any.required': 'שם פרטי הוא שדה חובה'
      }),
    lastName: Joi.string().min(2).max(50).required()
      .messages({
        'string.min': 'שם משפחה חייב להיות לפחות 2 תווים',
        'string.max': 'שם משפחה יכול להיות עד 50 תווים',
        'any.required': 'שם משפחה הוא שדה חובה'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'כתובת אימייל לא תקינה',
        'any.required': 'אימייל הוא שדה חובה'
      }),
    phone: Joi.string().pattern(/^0[5-9]\d{8}$/).required()
      .messages({
        'string.pattern.base': 'מספר טלפון לא תקין (לדוגמה: 0501234567)',
        'any.required': 'מספר טלפון הוא שדה חובה'
      })
  }).required()
    .messages({
      'any.required': 'פרטי יצירת קשר הם שדה חובה'
    }),
  
  shipping: Joi.object({
    address: Joi.string().min(5).max(200).required()
      .messages({
        'string.min': 'כתובת חייבת להיות לפחות 5 תווים',
        'string.max': 'כתובת יכולה להיות עד 200 תווים',
        'any.required': 'כתובת היא שדה חובה'
      }),
    city: Joi.string().min(2).max(50).required()
      .messages({
        'string.min': 'עיר חייבת להיות לפחות 2 תווים',
        'string.max': 'עיר יכולה להיות עד 50 תווים',
        'any.required': 'עיר היא שדה חובה'
      }),
    zipCode: Joi.string().min(5).max(10).required()
      .messages({
        'string.min': 'מיקוד חייב להיות לפחות 5 תווים',
        'string.max': 'מיקוד יכול להיות עד 10 תווים',
        'any.required': 'מיקוד הוא שדה חובה'
      }),
    method: Joi.string().valid('standard', 'express').default('standard')
      .messages({
        'string.valid': 'שיטת משלוח חייבת להיות "standard" או "express"'
      })
  }).required()
    .messages({
      'any.required': 'פרטי משלוח הם שדה חובה'
    }),
  
  payment: Joi.object({
    method: Joi.string().valid('credit').required()
      .messages({
        'string.valid': 'שיטת תשלום חייבת להיות כרטיס אשראי בלבד',
        'any.required': 'שיטת תשלום היא שדה חובה'
      }),
    cardLastFour: Joi.string().required()
      .messages({
        'any.required': '4 ספרות אחרונות של הכרטיס הן שדה חובה'
      })
  }).required()
    .messages({
      'any.required': 'פרטי תשלום הם שדה חובה'
    }),
  
  subtotal: Joi.number().min(0).required()
    .messages({
      'number.base': 'סכום ביניים חייב להיות מספר',
      'number.min': 'סכום ביניים לא יכול להיות שלילי',
      'any.required': 'סכום ביניים הוא שדה חובה'
    }),
  
  shippingCost: Joi.number().min(0).required()
    .messages({
      'number.base': 'עלות משלוח חייבת להיות מספר',
      'number.min': 'עלות משלוח לא יכולה להיות שלילית',
      'any.required': 'עלות משלוח היא שדה חובה'
    }),
  
  tax: Joi.number().min(0).required()
    .messages({
      'number.base': 'מס חייב להיות מספר',
      'number.min': 'מס לא יכול להיות שלילי',
      'any.required': 'מס הוא שדה חובה'
    }),
  
  total: Joi.number().min(0).required()
    .messages({
      'number.base': 'סכום כולל חייב להיות מספר',
      'number.min': 'סכום כולל לא יכול להיות שלילי',
      'any.required': 'סכום כולל הוא שדה חובה'
    }),
  
  notes: Joi.string().max(1000).allow('', null)
    .messages({
      'string.max': 'הערות יכולות להיות עד 1000 תווים'
    })
});

// סכמת ולידציה לעדכון סטטוס הזמנה
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required()
    .messages({
      'string.valid': 'סטטוס חייב להיות אחד מהערכים: pending, processing, shipped, delivered, cancelled',
      'any.required': 'סטטוס הוא שדה חובה'
    }),
  
  statusNote: Joi.string().max(500).allow('', null)
    .messages({
      'string.max': 'הערת סטטוס יכולה להיות עד 500 תווים'
    })
});
