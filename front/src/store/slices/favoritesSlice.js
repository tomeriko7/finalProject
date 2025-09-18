import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { favoriteApi } from "../../api/favoriteApi.js";

// Async thunks
const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.getFavorites();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addToFavoritesAsync = createAsyncThunk(
  "favorites/addToFavoritesAsync",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.addToFavorites(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const removeFromFavoritesAsync = createAsyncThunk(
  "favorites/removeFromFavoritesAsync",
  async (productId, { rejectWithValue }) => {
    try {
      await favoriteApi.removeFromFavorites(productId);
      return productId; // מחזיר רק את ה-ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const toggleFavoriteAsync = createAsyncThunk(
  "favorites/toggleFavoriteAsync",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.toggleFavorite(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const clearFavoritesAsync = createAsyncThunk(
  "favorites/clearFavoritesAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.clearFavorites();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  favorites: localStorage.getItem("favorites")
    ? JSON.parse(localStorage.getItem("favorites"))
    : [],
  quantity: localStorage.getItem("favoritesQuantity")
    ? parseInt(localStorage.getItem("favoritesQuantity"))
    : 0,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const { product } = action.payload;
      const productId = product.id || product._id;

      const exists = state.favorites.find(
        (item) => item.id === productId || item._id === productId
      );
      if (!exists) {
        const favoriteItem = {
          id: productId,
          _id: productId,
          name: product.name,
          image: product.image || product.imageUrl || "",
          imageUrl: product.imageUrl || product.image || "",
          price: product.price,
          discount: product.discount || 0,
          stockQuantity: product.stockQuantity || 0,
          slug: product.slug || "",
          category: product.category || "",
        };
        state.favorites.push(favoriteItem);
        state.quantity++;

        if (!state.isAuthenticated) {
          localStorage.setItem("favorites", JSON.stringify(state.favorites));
          localStorage.setItem("favoritesQuantity", state.quantity.toString());
        }
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(
        (item) => item.id !== productId && item._id !== productId
      );
      state.quantity = state.favorites.length;

      if (!state.isAuthenticated) {
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
        localStorage.setItem("favoritesQuantity", state.quantity.toString());
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.quantity = 0;
      if (!state.isAuthenticated) {
        localStorage.removeItem("favorites");
        localStorage.removeItem("favoritesQuantity");
      }
    },
    toggleFavorite: (state, action) => {
      const { product } = action.payload;
      const productId = product.id || product._id;

      const index = state.favorites.findIndex(
        (item) => item.id === productId || item._id === productId
      );

      if (index >= 0) {
        state.favorites.splice(index, 1);
        state.quantity--;
      } else {
        const favoriteItem = {
          id: productId,
          _id: productId,
          name: product.name,
          image: product.image || product.imageUrl || "",
          imageUrl: product.imageUrl || product.image || "",
          price: product.price,
          discount: product.discount || 0,
          stockQuantity: product.stockQuantity || 0,
          slug: product.slug || "",
          category: product.category || "",
        };
        state.favorites.push(favoriteItem);
        state.quantity++;
      }

      if (!state.isAuthenticated) {
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
        localStorage.setItem("favoritesQuantity", state.quantity.toString());
      }
    },
    isFavorite: (state, action) => {
      const productId = action.payload;
      return state.favorites.some(
        (item) => item.id === productId || item._id === productId
      );
    },
    setAuthenticationStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        const favoritesData = action.payload.data || action.payload || [];

        state.favorites = favoritesData.map((item) => {
          const product = item.product || item;
          return {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name,
            image: product.imageUrl || product.image || "",
            imageUrl: product.imageUrl || product.image || "",
            price: product.price,
            discount: product.discount || 0,
            stockQuantity: product.stockQuantity || 0,
            slug: product.slug || "",
            category: product.category || "",
          };
        });
        state.quantity = state.favorites.length;

        localStorage.removeItem("favorites");
        localStorage.removeItem("favoritesQuantity");
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const favoritesData = action.payload.data || action.payload || [];
        state.favorites = favoritesData.map((item) => {
          const product = item.product || item;
          return {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name,
            image: product.imageUrl || product.image || "",
            imageUrl: product.imageUrl || product.image || "",
            price: product.price,
            discount: product.discount || 0,
            stockQuantity: product.stockQuantity || 0,
            slug: product.slug || "",
            category: product.category || "",
          };
        });
        state.quantity = state.favorites.length;
      })
      .addCase(addToFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;

        state.favorites = state.favorites.filter(
          (item) => item.id !== productId && item._id !== productId
        );
        state.quantity = state.favorites.length;
      })
      .addCase(removeFromFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const favoritesData = action.payload.data || action.payload || [];
        state.favorites = favoritesData.map((item) => {
          const product = item.product || item;
          return {
            id: product._id || product.id,
            _id: product._id || product.id,
            name: product.name,
            image: product.imageUrl || product.image || "",
            imageUrl: product.imageUrl || product.image || "",
            price: product.price,
            discount: product.discount || 0,
            stockQuantity: product.stockQuantity || 0,
            slug: product.slug || "",
            category: product.category || "",
          };
        });
        state.quantity = state.favorites.length;
      })
      .addCase(toggleFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearFavoritesAsync.fulfilled, (state) => {
        state.loading = false;
        state.favorites = [];
        state.quantity = 0;
      })
      .addCase(clearFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  toggleFavorite,
  isFavorite,
  setAuthenticationStatus,
} = favoritesSlice.actions;

export {
  fetchFavorites,
  addToFavoritesAsync,
  removeFromFavoritesAsync,
  toggleFavoriteAsync,
  clearFavoritesAsync,
};

export default favoritesSlice.reducer;
