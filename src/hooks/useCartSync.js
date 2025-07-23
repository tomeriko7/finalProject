// hooks/useCartSync.js
import { useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../services/AuthContext.js';
import { 
  fetchCart, 
  syncCartAsync, 
  setAuthenticationStatus 
} from '../store/slices/cartSlice.js';
import { 
  fetchFavorites, 
  setAuthenticationStatus as setFavAuthStatus 
} from '../store/slices/favoritesSlice.js';

export const useCartSync = () => {
  const dispatch = useDispatch();
  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const { items: cartItems } = useSelector(state => state.cart);
  const { favorites } = useSelector(state => state.favorites);

  const syncWithServer = useCallback(async () => {
    if (!isAuthenticated || loading) {
      
      return;
    }

    try {
         
      // סנכרון מועדפים מהשרת
      
      await dispatch(fetchFavorites()).unwrap();
      
      // בדיקה אם יש פריטים ב-localStorage שצריך לסנכרן
      const localCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      
      if (localCartItems.length > 0) {
        
        // סנכרון סל קניות מ-localStorage
        const cartItemsForSync = localCartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        }));
        
        await dispatch(syncCartAsync(cartItemsForSync)).unwrap();
        
        // ניקוי localStorage לאחר סנכרון מוצלח
        localStorage.removeItem('cart');
        
      } else {
        // אם אין פריטים ב-localStorage, טען מהשרת
        console.error('useCartSync: No local cart items, fetching from server...');
        await dispatch(fetchCart()).unwrap();
      }
      
      // ניקוי מועדפים מ-localStorage לאחר סנכרון
      localStorage.removeItem('favorites');
      localStorage.removeItem('favoritesQuantity');
      
      
    } catch (error) {
      console.error('useCartSync: Error syncing with server:', error);
    }
  }, [dispatch, isAuthenticated, loading]);

  useEffect(() => {
    // עדכון סטטוס האימות ב-slices
    dispatch(setAuthenticationStatus(isAuthenticated));
    dispatch(setFavAuthStatus(isAuthenticated));

    if (isAuthenticated && !loading) {
      
      syncWithServer();
    }
  }, [isAuthenticated, loading, dispatch, syncWithServer]);

  return {
    syncWithServer
  };
};
