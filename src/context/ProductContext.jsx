// FILE: src/context/ProductContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';

const ProductContext = createContext();

const initialState = {
  products: JSON.parse(localStorage.getItem('products')) || [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      const updated = [...state.products, action.payload];
      localStorage.setItem('products', JSON.stringify(updated));
      return { products: updated };
    case 'DELETE_PRODUCT':
      const filtered = state.products.filter(p => p.id !== action.payload);
      localStorage.setItem('products', JSON.stringify(filtered));
      return { products: filtered };
    default:
      return state;
  }
}

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(state.products));
  }, [state.products]);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;