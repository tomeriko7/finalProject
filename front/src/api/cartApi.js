// api/cartApi.js
import { API_BASE_URL } from "../config/constants.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const cartApi = {
  // קבלת סל הקניות
  getCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  // הוספת מוצר לסל הקניות
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // עדכון כמות מוצר בסל
  updateCartQuantity: async (cartItemId, quantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart quantity");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      throw error;
    }
  },

  // הסרת מוצר מסל הקניות
  removeFromCart: async (cartItemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from cart");
      }

      return await response.json();
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  // ניקוי כל סל הקניות
  clearCart: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      return await response.json();
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  // סנכרון סל קניות מ-localStorage
  syncCart: async (cartItems) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync cart");
      }

      return await response.json();
    } catch (error) {
      console.error("Error syncing cart:", error);
      throw error;
    }
  },
};
