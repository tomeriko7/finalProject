import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// פונקציית עזר לקבלת טוקן האימות מהאחסון המקומי
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// קבלת סיכום נתונים ללוח הבקרה
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'שגיאה בקבלת נתוני לוח הבקרה' };
  }
};

// קבלת הזמנות אחרונות
export const getRecentOrders = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/admin/orders?limit=${limit}`, {
      headers: { ...getAuthHeader() }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'שגיאה בטעינת הזמנות אחרונות' };
  }
};

// קבלת משתמשים אחרונים
export const getRecentUsers = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users?limit=${limit}&sort=-createdAt`, {
      headers: { ...getAuthHeader() }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'שגיאה בטעינת משתמשים אחרונים' };
  }
};

// קבלת מוצרים אחרונים
export const getRecentProducts = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/products?limit=${limit}&sort=-createdAt`, {
      headers: { ...getAuthHeader() }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'שגיאה בטעינת מוצרים אחרונים' };
  }
};

// קבלת סטטיסטיקות מכירות לפי תקופה
export const getSalesStats = async (period = 'month') => {
  try {
    const response = await axios.get(`${API_URL}/admin/sales?period=${period}`, {
      headers: { ...getAuthHeader() }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'שגיאה בקבלת נתוני מכירות' };
  }
};
