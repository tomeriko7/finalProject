// api/api.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
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
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login";
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
        return "Please login to continue.";
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

export default api;
