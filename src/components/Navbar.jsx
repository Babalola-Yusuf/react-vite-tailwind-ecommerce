// FILE: src/components/Navbar.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

export default function Navbar() {
  const { state: cartState } = useContext(CartContext);
  const { state: wishlistState } = useContext(WishlistContext);
  const cartCount =
    cartState?.totals?.count ||
    (cartState.cart ? cartState.cart.reduce((s, i) => s + (i.quantity || 0), 0) : 0);
  const wishlistCount = wishlistState?.wishlist?.length || 0;

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll to toggle styles
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md py-2'
          : 'bg-white shadow-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition"
        >
          MyStore
        </Link>

        <nav className="flex items-center gap-5 text-gray-700 font-medium">
          <NavLink to="/" currentPath={location.pathname}>
            Home
          </NavLink>
          <NavLink to="/admin" currentPath={location.pathname}>
            Admin
          </NavLink>

          <Link to="/wishlist" className="relative hover:text-blue-600 transition">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-1.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative hover:text-blue-600 transition">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white rounded-full text-xs px-1.5">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children, currentPath }) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={`relative pb-1 transition ${
        isActive
          ? 'text-blue-600 font-semibold after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-600'
          : 'hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
}
