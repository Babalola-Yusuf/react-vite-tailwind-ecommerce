// FILE: src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductContext from '../context/ProductContext';

export default function Home() {
  const { state } = useContext(ProductContext);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Products</h1>
      {state.products.length === 0 ? (
        <p>No products available. Add from Admin Page.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {state.products.map(product => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}