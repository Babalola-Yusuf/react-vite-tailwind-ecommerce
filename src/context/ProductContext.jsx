// FILE: src/context/ProductContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ProductContext = createContext();

const initialState = {
  products: JSON.parse(localStorage.getItem('products')) || [],
  categories: JSON.parse(localStorage.getItem('categories')) || [
    'General',
    'Electronics',
    'Clothing',
    'Accessories'
  ],
};


function reducer(state, action) {
  let updatedProducts;
  switch (action.type) {
    case 'ADD_PRODUCT': {
      // action.payload should be full product (may contain id)
      const newProduct = { ...action.payload, id: action.payload.id || Date.now() };
      updatedProducts = [...state.products, newProduct];
      toast.success('Product added');
      return { ...state, products: updatedProducts };
    }
    case 'UPDATE_PRODUCT': {
      updatedProducts = state.products.map(p =>
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      );
      toast.success('Product updated');
      return { ...state, products: updatedProducts };
    }
    case 'REMOVE_PRODUCT': {
      updatedProducts = state.products.filter(p => p.id !== action.payload);
      toast('Product removed', { icon: '🗑️' });
      return { ...state, products: updatedProducts };
    }
    case 'CLEAR_PRODUCTS': {
      toast('All products cleared', { icon: '🧹' });
      return { ...state, products: [] };
    }
    case 'ADD_CATEGORY': {
      if (!action.payload) return state;
      const exists = state.categories.includes(action.payload);
      if (exists) {
        toast.error('Category already exists');
        return state;
      }
      const updated = [...state.categories, action.payload];
      toast.success('Category added');
      return { ...state, categories: updated };
    }
    case 'REMOVE_CATEGORY': {
      const updated = state.categories.filter(c => c !== action.payload);
      toast('Category removed', { icon: '🗑️' });
      // Also optionally remove categories from products? We leave product category intact (admin can edit)
      return { ...state, categories: updated };
    }
    default:
      return state;
  }
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // persist products and categories
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(state.products));
      localStorage.setItem('categories', JSON.stringify(state.categories));
    } catch (err) {
      console.warn('Failed to persist products/categories', err);
    }
  }, [state.products, state.categories]);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
