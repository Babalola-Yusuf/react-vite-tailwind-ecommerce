// FILE: src/pages/ProductDetails.jsx
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductContext from '../context/ProductContext';
import CartContext from '../context/CartContext';
import WishlistContext from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { state: productState } = useContext(ProductContext);
  const { dispatch: cartDispatch } = useContext(CartContext);
  const { wishlist = [], toggleWishlist } = useContext(WishlistContext) || {};

  const product = productState.products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="text-center mt-20 text-xl">
        Product not found.
      </div>
    );
  }

  const isWishlisted = wishlist?.some(item => item.id === product.id);

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast(isWishlisted ? 'Removed from wishlist 💔' : 'Added to wishlist ❤️');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full md:w-1/2 h-80 object-cover rounded-lg border"
        />

        <div className="flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <button
                onClick={handleToggleWishlist}
                className="p-2 text-red-500 hover:text-red-700 transition"
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className="w-6 h-6"
                  fill={isWishlisted ? 'red' : 'none'}
                  strokeWidth={2}
                />
              </button>
            </div>

            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-blue-600 mb-6">
              ${product.price}
            </p>

            {product.category && (
              <p className="text-sm text-gray-500 mb-4">
                Category: <span className="font-medium">{product.category}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition w-fit"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
