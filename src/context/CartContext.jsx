// FILE: src/context/CartContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  totals: { count: 0, totalPrice: 0 },
};

function calculateTotals(cart) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return { count, totalPrice };
}

function reducer(state, action) {
  let updatedCart;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.payload.id);
      if (existing) {
        updatedCart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        toast.success('Increased quantity in cart');
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
        toast.success('Added to cart');
      }
      return { ...state, cart: updatedCart, totals: calculateTotals(updatedCart) };
    }
    case 'REMOVE_FROM_CART': {
      updatedCart = state.cart.filter(item => item.id !== action.payload);
      toast.error('Removed from cart');
      return { ...state, cart: updatedCart, totals: calculateTotals(updatedCart) };
    }
    case 'INCREASE_QUANTITY': {
      updatedCart = state.cart.map(item =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { ...state, cart: updatedCart, totals: calculateTotals(updatedCart) };
    }
    case 'DECREASE_QUANTITY': {
      updatedCart = state.cart
        .map(item =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
      return { ...state, cart: updatedCart, totals: calculateTotals(updatedCart) };
    }
    case 'CLEAR_CART': {
      toast('Cart cleared', { icon: '🛒' });
      return { ...state, cart: [], totals: { count: 0, totalPrice: 0 } };
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
