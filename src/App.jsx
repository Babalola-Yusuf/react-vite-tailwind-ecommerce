// FILE: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs'; // ✅ ensure this line exists
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <Breadcrumbs /> {/* ✅ Breadcrumbs should be here */}
            <main className="p-4 min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
  );
}
