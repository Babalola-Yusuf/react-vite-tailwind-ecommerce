// FILE: src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductContext from '../context/ProductContext';

export default function Home() {
  const { state } = useContext(ProductContext);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.products.length === 0 && (
          <p className="col-span-full text-center text-lg">No products available yet.</p>
        )}
        {state.products.map(product => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-200"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-4 truncate">{product.description}</p>
              <p className="text-lg font-bold text-blue-600 mb-4">${product.price}</p>
              <Link
                to={`/product/${product.id}`}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
