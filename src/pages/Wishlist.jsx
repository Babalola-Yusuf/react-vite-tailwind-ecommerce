// FILE: src/pages/Wishlist.jsx
import React, { useContext } from 'react';
import WishlistContext from '../context/WishlistContext';
import CartContext from '../context/CartContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, clearWishlist } = useContext(WishlistContext);
  const { dispatch: cartDispatch } = useContext(CartContext);

  const handleMoveToCart = (item) => {
    cartDispatch({ type: 'ADD_TO_CART', payload: item });
    toggleWishlist(item); // Removes from wishlist
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) clearWishlist();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600 mt-8">Your wishlist is empty. ❤️</p>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || item.images?.[0] || '/placeholder.png'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500">${item.price}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(item)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleClear}
              className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800 transition"
            >
              Clear Wishlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
