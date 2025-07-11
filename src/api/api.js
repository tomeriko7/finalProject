// api/api.js
import axios from "axios";

// API base URL
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // רק אם זה מ־/profile, לא מוחקים מיד
    if (error.response?.status === 401) {
      console.warn("⚠️ שגיאת 401 - לא מוחק טוקן אוטומטית");
      // תוכל כאן להציג Snackbar או להפנות לדף התחברות בצורה רכה יותר
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  // login
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },

  // Update Profile
  updateProfile: async (userData) => {
    const response = await api.put("/api/auth/profile", userData);
    return response.data;
  },

  // Change Password
  changePassword: async (passwordData) => {
    const response = await api.put("/api/auth/change-password", passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post("/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Verify Token
  verifyToken: async () => {
    const response = await api.get("/api/auth/verify-token");
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    const { data, status } = error.response;

    switch (status) {
      case 400:
        return data.message || "Invalid input. Please check your data.";
      case 401:
        return "פרטי משתמש שגויים , נסה שוב 🫣 ";
      case 403:
        return "You don't have permission for this action.";
      case 404:
        return "Resource not found.";
      case 422:
        return data.message || "Validation error.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return data.message || "Something went wrong.";
    }
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};

// Product API functions
export const productAPI = {
  // Get all products
  getProducts: async (page = 1, search = '') => {
    const response = await api.get(`/api/products?page=${page}&search=${search}`);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Create a new product
  createProduct: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  // Update a product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // Delete a product
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  // Upload product image
  uploadProductImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.imageUrl;
  },
};

export default api;
