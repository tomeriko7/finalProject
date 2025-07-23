// api/favoriteApi.js
import { API_BASE_URL } from "../config/constants.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const favoriteApi = {
  // קבלת רשימת המועדפים
  getFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  // הוספת מוצר למועדפים
  addToFavorites: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to favorites");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  },

  // הסרת מוצר מהמועדפים
  removeFromFavorites: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  },

  // החלפת סטטוס מועדפים
  toggleFavorite: async (productId) => {
    
    try {
      const headers = getAuthHeaders();
     
      const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ productId }),
      });

      

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to toggle favorite: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  },

  // ניקוי כל המועדפים
  clearFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to clear favorites");
      }

      return await response.json();
    } catch (error) {
      console.error("Error clearing favorites:", error);
      throw error;
    }
  },
};
