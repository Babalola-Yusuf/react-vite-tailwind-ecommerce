// FILE: src/components/Navbar.jsx (Updated)
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">ShopEasy</Link>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/cart" className="hover:text-gray-200">Cart</Link>
          <Link to="/admin" className="hover:text-gray-200">Admin</Link>
        </div>
      </div>
    </nav>
  );
}