// FILE: src/pages/ProductDetails.jsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductContext from '../context/ProductContext';
import CartContext from '../context/CartContext';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { state: productState } = useContext(ProductContext);
  const { dispatch: cartDispatch } = useContext(CartContext);

  const product = productState.products.find(p => p.id === Number(id));

  if (!product) {
    return <div className="text-center mt-20 text-xl">Product not found</div>;
  }

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full md:w-1/2 h-80 object-cover rounded-lg border"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-blue-600 mb-6">${product.price}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-fit"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}