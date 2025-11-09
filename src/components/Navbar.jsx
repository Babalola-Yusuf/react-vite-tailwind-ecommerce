// FILE: src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

export default function Navbar() {
  const { state: cartState } = useContext(CartContext);
  const { state: wishlistState } = useContext(WishlistContext);
  const cartCount = (cartState?.totals?.count) || (cartState.cart ? cartState.cart.reduce((s, i) => s + (i.quantity || 0), 0) : 0);
  const wishlistCount = wishlistState?.wishlist?.length || 0;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">MyStore</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/admin" className="hover:text-blue-600">Admin</Link>
          <Link to="/wishlist" className="relative">
            <Heart />
            {wishlistCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-1">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-blue-600 text-white rounded-full text-xs px-1">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
