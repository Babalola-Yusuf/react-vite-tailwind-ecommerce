// FILE: src/components/Breadcrumbs.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductContext from '../context/ProductContext';

export default function Breadcrumbs() {
  const location = useLocation();
  const { state } = useContext(ProductContext);

  const pathnames = location.pathname.split('/').filter(x => x);

  // Detect special cases
  const isProductPage = pathnames[0] === 'product' && pathnames.length === 2;
  const isCartPage = pathnames[0] === 'cart';
  const isCheckoutPage = pathnames[0] === 'checkout';
  const isAdminPage = pathnames[0] === 'admin';

  // If on a product page, get product name
  let productName = '';
  if (isProductPage) {
    const product = state.products.find(p => p.id === Number(pathnames[1]));
    productName = product ? product.name : `Product : ${pathnames[1]}`;
  }

  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4 flex-wrap">
      {/* Always show Home */}
      <Link to="/" className="hover:text-blue-600 transition">
        Home
      </Link>

      {/* Product details page */}
      {isProductPage && (
        <>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-800 font-medium">
            Product : <span className="text-gray-500">{productName}</span>
          </span>
        </>
      )}

      {/* Cart page */}
      {isCartPage && (
        <>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-800 font-medium">Cart</span>
        </>
      )}

      {/* Checkout page */}
      {isCheckoutPage && (
        <>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <Link to="/cart" className="hover:text-blue-600 transition">
            Cart
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-800 font-medium">Checkout</span>
        </>
      )}

      {/* Admin page */}
      {isAdminPage && (
        <>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-800 font-medium">Admin Dashboard</span>
        </>
      )}
    </nav>
  );
}
