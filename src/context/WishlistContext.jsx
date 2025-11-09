// FILE: src/context/WishlistContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {
      return [];
    }
  });

  // Save wishlist in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast.error('Removed from wishlist 💔');
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success('Added to wishlist ❤️');
        return [...prev, product];
      }
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast('Wishlist cleared 🧹');
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
