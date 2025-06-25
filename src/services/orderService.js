import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// יצירת הזמנה חדשה
export const createOrder = async (orderData) => {
  try {
    // נסה קודם את הנתיב המקורי ואם יש שגיאה - נסה נתיב חלופי
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (innerError) {
      if (innerError.response && innerError.response.status === 404) {
        // נסה נתיב חלופי
        console.log('Trying alternative endpoint...');
        const response = await axios.post(`${API_BASE_URL}/order`, orderData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return response.data;
      } else {
        throw innerError;
      }
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// קבלת כל ההזמנות של המשתמש
export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/user`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// קבלת הזמנה לפי מזהה
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// קבלת כל ההזמנות (למנהלים בלבד)
export const getAllOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/orders/admin?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// עדכון סטטוס הזמנה (למנהלים בלבד)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, 
      { status }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// מחיקת הזמנה (למנהלים בלבד)
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
