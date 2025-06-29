// hooks/useLogout.js
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "../services/AuthContext";
import {
  clearCart,
  setAuthenticationStatus as setCartAuthStatus,
} from "../store/slices/cartSlice";
import {
  clearFavorites,
  setAuthenticationStatus as setFavAuthStatus,
} from "../store/slices/favoritesSlice";

export const useLogout = () => {
  const { logout: authLogout } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isClearing, setIsClearing] = useState(false);

  const logout = async () => {
    setIsClearing(true);
    
    try {
      // שלב 1: ניקוי Redux state
      await new Promise(resolve => setTimeout(resolve, 200));
      dispatch(clearCart());
      dispatch(clearFavorites());
      
      // שלב 2: עדכון סטטוס האימות ב-Redux
      await new Promise(resolve => setTimeout(resolve, 200));
      dispatch(setCartAuthStatus(false));
      dispatch(setFavAuthStatus(false));
      
      // שלב 3: ניקוי localStorage
      await new Promise(resolve => setTimeout(resolve, 200));
      const keysToRemove = [
        "user",
        "token",
        "cart",
        "favorites",
        "favoritesQuantity",
        "userPreferences",
        "recentSearches",
        "lastVisitedPage",
      ];
      
      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
      });
      
      // שלב 4: ניקוי sessionStorage
      await new Promise(resolve => setTimeout(resolve, 200));
      sessionStorage.clear();
      
      // שלב 5: ניקוי AuthContext
      await new Promise(resolve => setTimeout(resolve, 200));
      authLogout();
      
      console.log('User logged out successfully - all data cleared');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsClearing(false);
    }
  };

  return { logout, isClearing };
};

