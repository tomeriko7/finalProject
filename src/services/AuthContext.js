import React, { createContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
import { clearFavorites } from "../store/slices/favoritesSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // הוספת מצב טעינה

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // סימון שהטעינה הסתיימה
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    // ניקוי מצב המשתמש
    setUser(null);
    
    // ניקוי localStorage מכל הנתונים הקשורים למשתמש
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    localStorage.removeItem("favoritesQuantity");
    
    // אם יש עוד מפתחות של localStorage שקשורים למשתמש, נוסיף אותם כאן
    // לדוגמה:
    // localStorage.removeItem("userPreferences");
    // localStorage.removeItem("recentSearches");
    
    // ניקוי sessionStorage (אם משתמשים בו)
    sessionStorage.clear();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
