// FILE: src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import CartContext from '../context/CartContext';

export default function Navbar() {
  const { state } = useContext(CartContext);
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold">ShopEasy</Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/admin" className="hover:text-gray-200">Admin</Link>
          <Link to="/cart" className="relative flex items-center hover:text-gray-200">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}