import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductContext from '../context/ProductContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { state } = useContext(ProductContext);
  const product = state.products.find(p => p.id.toString() === id);

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-lg text-gray-700 mb-2">Price: ${product.price}</p>
      <p className="text-gray-600">{product.description}</p>
    </div>
  );
}
