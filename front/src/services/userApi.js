import api from './api';

// שירות API למשתמשים
export const userApi = {
  // קבלת כל המשתמשים עם פרמטרים לסינון ודפדוף
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/api/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // קבלת משתמש לפי מזהה
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // הוספת משתמש חדש
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // עדכון משתמש קיים
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // מחיקת משתמש
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },
  
  // עדכון סטטוס מנהל של משתמש
  toggleAdminStatus: async (id, isAdmin) => {
    try {
      const response = await api.patch(`/api/users/${id}/admin-status`, { isAdmin });
      return response.data;
    } catch (error) {
      console.error(`Error updating admin status for user ${id}:`, error);
      throw error;
    }
  }
};

export default userApi;
