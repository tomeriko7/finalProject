// קבועים של האפליקציה

// כתובת בסיס של ה-API
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// הגדרות עמוד
export const ITEMS_PER_PAGE = 12;

// הגדרות משלוח
export const SHIPPING_COST = 50;
export const FREE_SHIPPING_THRESHOLD = 500;

// הגדרות מע"מ
export const TAX_RATE = 0.17;

// סטטוסי הזמנות
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// תפקידי משתמשים
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};
