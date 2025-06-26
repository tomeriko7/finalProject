// validations/userValidation.js
import Joi from 'joi';

// Common validation patterns
const patterns = {
  israeliPhone: /^0[5-9]\d{8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
};

// User registration validation schema
export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.min': 'שם פרטי חייב להכיל לפחות 2 תווים',
      'string.max': 'שם פרטי יכול להכיל עד 50 תווים',
      'any.required': 'שם פרטי הוא שדה חובה'
    }),
  
  lastName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.min': 'שם משפחה חייב להכיל לפחות 2 תווים',
      'string.max': 'שם משפחה יכול להכיל עד 50 תווים',
      'any.required': 'שם משפחה הוא שדה חובה'
    }),
  
  email: Joi.string().email().required()
    .messages({
      'string.email': 'כתובת האימייל אינה תקינה',
      'any.required': 'אימייל הוא שדה חובה'
    }),
  
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'סיסמה חייבת להכיל לפחות 6 תווים',
      'any.required': 'סיסמה היא שדה חובה'
    }),
  
  phone: Joi.string().pattern(patterns.israeliPhone).required()
    .messages({
      'string.pattern.base': 'מספר טלפון לא תקין (לדוגמה: 0501234567)',
      'any.required': 'מספר טלפון הוא שדה חובה'
    }),
  
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    zipCode: Joi.string().allow('', null)
  }).optional(),
  
  dateOfBirth: Joi.date().allow(null).optional()
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'כתובת האימייל אינה תקינה',
      'any.required': 'אימייל הוא שדה חובה'
    }),
  
  password: Joi.string().required()
    .messages({
      'any.required': 'סיסמה היא שדה חובה'
    })
});

// Profile update validation schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional()
    .messages({
      'string.min': 'שם פרטי חייב להכיל לפחות 2 תווים',
      'string.max': 'שם פרטי יכול להכיל עד 50 תווים'
    }),
  
  lastName: Joi.string().trim().min(2).max(50).optional()
    .messages({
      'string.min': 'שם משפחה חייב להכיל לפחות 2 תווים',
      'string.max': 'שם משפחה יכול להכיל עד 50 תווים'
    }),
  
  phone: Joi.string().pattern(patterns.israeliPhone).optional()
    .messages({
      'string.pattern.base': 'מספר טלפון לא תקין (לדוגמה: 0501234567)'
    }),
  
  address: Joi.object({
    street: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    zipCode: Joi.string().allow('', null)
  }).optional(),
  
  dateOfBirth: Joi.date().allow(null).optional()
});

// Change password validation schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'any.required': 'סיסמה נוכחית היא שדה חובה'
    }),
  
  newPassword: Joi.string().min(6).required()
    .messages({
      'string.min': 'סיסמה חדשה חייבת להכיל לפחות 6 תווים',
      'any.required': 'סיסמה חדשה היא שדה חובה'
    }),
  
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    .messages({
      'any.only': 'אימות הסיסמה אינו תואם לסיסמה החדשה',
      'any.required': 'אימות סיסמה הוא שדה חובה'
    })
});
