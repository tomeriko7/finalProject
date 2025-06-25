import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const calculateCartTotals = (items) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
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
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity
        });
      }
      
      const { itemCount, subtotal } = calculateCartTotals(state.items);
      state.itemCount = itemCount;
      state.subtotal = subtotal;
      state.total = subtotal + state.shipping + state.tax;
      
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    updateCartQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      
      if (item) {
        item.quantity = quantity;
        
        const { itemCount, subtotal } = calculateCartTotals(state.items);
        state.itemCount = itemCount;
        state.subtotal = subtotal;
        state.total = subtotal + state.shipping + state.tax;
        
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
      
      const { itemCount, subtotal } = calculateCartTotals(state.items);
      state.itemCount = itemCount;
      state.subtotal = subtotal;
      state.total = subtotal + state.shipping + state.tax;
      
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.total = 0;
      
      localStorage.removeItem('cart');
    },
    
    updateShipping: (state, action) => {
      state.shipping = action.payload;
      state.total = state.subtotal + state.shipping + state.tax;
    },
    
    updateTax: (state, action) => {
      state.tax = action.payload;
      state.total = state.subtotal + state.shipping + state.tax;
    }
  }
});

export const { 
  addToCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart,
  updateShipping,
  updateTax
} = cartSlice.actions;


export default cartSlice.reducer;
 