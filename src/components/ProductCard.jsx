// FILE: src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
      
      {/* Clickable product area */}
      <Link to={`/product/${product.id}`} className="block">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg mb-3 h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg mb-3">
            No Image
          </div>
        )}

        <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
        <p className="text-gray-600 mb-2">${product.price}</p>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
      </Link>

      {/* Fake button (safe) */}
      <Link
        to={`/product/${product.id}`}
        className="mt-3 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
}
