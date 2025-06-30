import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../api/cartApi.js";

// Async thunks for server operations
const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(productId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateCartQuantityAsync = createAsyncThunk(
  "cart/updateCartQuantityAsync",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartQuantity(cartItemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(cartItemId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const syncCartAsync = createAsyncThunk(
  "cart/syncCartAsync",
  async (cartItems, { rejectWithValue }) => {
    try {
      const response = await cartApi.syncCart(cartItems);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    console.log("Loading cart from localStorage:", parsedCart);
    return parsedCart;
  }
  return [];
};

const calculateCartTotals = (items) => {
  if (!items || items.length === 0) return { itemCount: 0, subtotal: 0 };
  
  const itemCount = items.reduce((total, item) => total + Number(item.quantity || 1), 0);
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.price || item.product?.price || 0);
    const quantity = Number(item.quantity || 1);
    if (isNaN(price) || isNaN(quantity)) return total;
    return total + (price * quantity);
  }, 0);
  
  return { itemCount, subtotal };
};

const initialCartItems = loadCartFromStorage();
const { itemCount, subtotal } = calculateCartTotals(initialCartItems);

const initialState = {
  items: initialCartItems,
  itemCount,
  subtotal,
  shipping: 0,
  tax: 0,
  total: subtotal,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        });
      }

      const { itemCount, subtotal } = calculateCartTotals(state.items);
      state.itemCount = itemCount;
      state.subtotal = subtotal;
      state.total = subtotal + state.shipping + state.tax;

      if (!state.isAuthenticated) {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    updateCartQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item._id === itemId);

      if (item) {
        item.quantity = quantity;

        const { itemCount, subtotal } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.subtotal = subtotal;
        state.total = subtotal + state.shipping + state.tax;

        if (!state.isAuthenticated) {
          localStorage.setItem("cart", JSON.stringify(state.items));
        }
      }
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item._id !== itemId);

      const { itemCount, subtotal } = calculateCartTotals(state.items);
      state.itemCount = itemCount;
      state.subtotal = subtotal;
      state.total = subtotal + state.shipping + state.tax;

      if (!state.isAuthenticated) {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.total = 0;

      // מחיקת localStorage תמיד, גם עבור משתמשים מחוברים וגם לא מחוברים
      // מחיקת כל נתוני העגלה מה-localStorage
      localStorage.removeItem("cart");
      localStorage.removeItem("cartQuantity");
      localStorage.removeItem("cartTotal");
    },

    updateShipping: (state, action) => {
      state.shipping = action.payload;
      state.total = state.subtotal + state.shipping + state.tax;
    },

    updateTax: (state, action) => {
      state.tax = action.payload;
      state.total = state.subtotal + state.shipping + state.tax;
    },

    setAuthenticationStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const cartData = action.payload;
        state.items = cartData.items || [];
        state.itemCount = cartData.summary?.totalItems || 0;
        state.subtotal = cartData.summary?.totalPrice || 0;
        state.total = state.subtotal + state.shipping + state.tax;
        // Clear localStorage when synced with server
        localStorage.removeItem("cart");
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart async
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        const { itemCount, subtotal } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.subtotal = subtotal;
        state.total = subtotal + state.shipping + state.tax;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update cart quantity async
      .addCase(updateCartQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        const { itemCount, subtotal } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.subtotal = subtotal;
        state.total = subtotal + state.shipping + state.tax;
      })
      .addCase(updateCartQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart async
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        const { itemCount, subtotal } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.subtotal = subtotal;
        state.total = subtotal + state.shipping + state.tax;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear cart async
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.itemCount = 0;
        state.subtotal = 0;
        state.total = 0;
        // מחיקת localStorage גם עבור מחיקה אסינכרונית
        localStorage.removeItem("cart");
        localStorage.removeItem("cartQuantity");
        localStorage.removeItem("cartTotal");
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync cart async
      .addCase(syncCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        const { itemCount, subtotal } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.subtotal = subtotal;
        state.total = subtotal + state.shipping + state.tax;
      })
      .addCase(syncCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  updateShipping,
  updateTax,
  setAuthenticationStatus,
} = cartSlice.actions;

// Export async thunks separately - no duplicate exports
export {
  fetchCart,
  addToCartAsync,
  updateCartQuantityAsync,
  removeFromCartAsync,
  clearCartAsync,
  syncCartAsync,
};

export default cartSlice.reducer;
