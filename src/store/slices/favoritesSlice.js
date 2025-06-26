import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: localStorage.getItem('favorites') 
    ? JSON.parse(localStorage.getItem('favorites')) 
    : [],
  quantity: localStorage.getItem('favoritesQuantity') 
    ? parseInt(localStorage.getItem('favoritesQuantity')) 
    : 0,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const { product } = action.payload;
      const productId = product.id || product._id;
      
      // אם המוצר כבר קיים במועדפים, לא נוסיף אותו שוב
      const existingItem = state.favorites.find(item => 
        (item.id === productId) || (item._id === productId)
      );
      
      if (!existingItem) {
        // הוספת מוצר למועדפים
        const favoriteItem = {
          id: productId,
          _id: productId,
          name: product.name,
          image: product.image || product.imageUrl || '',
          imageUrl: product.imageUrl || product.image || '',
          price: product.price,
          discount: product.discount || 0,
          stockQuantity: product.stockQuantity || 0,
          slug: product.slug || '',
          category: product.category || '',
        };
        
        state.favorites.push(favoriteItem);
        state.quantity += 1;
        
        // עדכון ב-localStorage
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
        localStorage.setItem('favoritesQuantity', state.quantity.toString());
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      
      state.favorites = state.favorites.filter(item => 
        (item.id !== productId) && (item._id !== productId)
      );
      
      state.quantity = state.favorites.length;
      
      // עדכון ב-localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
      localStorage.setItem('favoritesQuantity', state.quantity.toString());
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.quantity = 0;
      
      localStorage.removeItem('favorites');
      localStorage.removeItem('favoritesQuantity');
    },
    toggleFavorite: (state, action) => {
      const { product } = action.payload;
      const productId = product.id || product._id;
      
      const existingIndex = state.favorites.findIndex(item => 
        (item.id === productId) || (item._id === productId)
      );
      
      if (existingIndex >= 0) {
        // אם המוצר קיים, הסר אותו
        state.favorites.splice(existingIndex, 1);
        state.quantity -= 1;
      } else {
        // אם המוצר לא קיים, הוסף אותו
        const favoriteItem = {
          id: productId,
          _id: productId,
          name: product.name,
          image: product.image || product.imageUrl || '',
          imageUrl: product.imageUrl || product.image || '',
          price: product.price,
          discount: product.discount || 0,
          stockQuantity: product.stockQuantity || 0,
          slug: product.slug || '',
          category: product.category || '',
        };
        
        state.favorites.push(favoriteItem);
        state.quantity += 1;
      }
      
      // עדכון ב-localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
      localStorage.setItem('favoritesQuantity', state.quantity.toString());
    },
    isFavorite: (state, action) => {
      const productId = action.payload;
      return state.favorites.some(item => 
        (item.id === productId) || (item._id === productId)
      );
    }
  },
});

export const { 
  addToFavorites, 
  removeFromFavorites, 
  clearFavorites,
  toggleFavorite,
  isFavorite 
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
