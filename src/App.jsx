// FILE: src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs'; 
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Navbar />
        <main className="p-4 min-h-screen bg-gray-50">
          <div className="bg-white p-3 rounded-lg shadow-sm mb-6">
            <Breadcrumbs />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </CartProvider>
    </ProductProvider>
  );
}
