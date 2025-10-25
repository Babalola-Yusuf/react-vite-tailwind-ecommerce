// FILE: src/context/CartContext.jsx
import React, { createContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const updated = [...state.cart, action.payload];
      localStorage.setItem('cart', JSON.stringify(updated));
      return { cart: updated };
    case 'REMOVE_FROM_CART':
      const filtered = state.cart.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(filtered));
      return { cart: filtered };
    case 'CLEAR_CART':
      localStorage.removeItem('cart');
      return { cart: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;