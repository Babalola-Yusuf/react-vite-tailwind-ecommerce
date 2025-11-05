// FILE: src/context/ProductContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';

const ProductContext = createContext();

const initialState = {
  products: JSON.parse(localStorage.getItem('products')) || [],
};

function reducer(state, action) {
  let updatedProducts;
  switch (action.type) {
    case 'ADD_PRODUCT': {
      updatedProducts = [...state.products, { ...action.payload, id: Date.now() }];
      return { products: updatedProducts };
    }
    case 'REMOVE_PRODUCT': {
      updatedProducts = state.products.filter(p => p.id !== action.payload);
      return { products: updatedProducts };
    }
    case 'UPDATE_PRODUCT': {
      updatedProducts = state.products.map(p =>
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      );
      return { products: updatedProducts };
    }
    case 'CLEAR_PRODUCTS': {
      return { products: [] };
    }
    default:
      return state;
  }
}

export const ProductProvider = ({ children }) => {
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
