// FILE: src/pages/Cart.jsx
import React, { useContext, useEffect, useState } from 'react';
import CartContext from '../context/CartContext';
import ProductContext from '../context/ProductContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { state: cartState, dispatch } = useContext(CartContext);
  const { state: productState } = useContext(ProductContext);
  const [syncedCart, setSyncedCart] = useState(cartState.cart || []);
  const [backupCart, setBackupCart] = useState([]);
  const navigate = useNavigate();

  const safePrice = price => (typeof price === 'number' ? price : parseFloat(price) || 0);

  // Sync cart items with latest product updates and cart state changes
  useEffect(() => {
    const updated = cartState.cart.map(item => {
      const latest = productState.products.find(p => p.id === item.id);
      return latest ? { ...item, ...latest } : item;
    });
    setSyncedCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }, [productState.products, cartState.cart]);

  const handleCheckout = () => {
    setBackupCart(syncedCart); // backup before proceeding
    toast.success('Redirecting to payment gateway...');
    navigate('/checkout'); // simulate redirect to payment
  };

  const handleClearCart = () => {
    setBackupCart(syncedCart);
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart');
    toast('Cart cleared', { icon: '🧹' });
  };

  const handleRestoreCart = () => {
    if (backupCart.length > 0) {
      backupCart.forEach(item => dispatch({ type: 'ADD_TO_CART', payload: item }));
      toast.success('Cart restored!');
      setBackupCart([]);
    } else {
      toast.error('No backup cart found.');
    }
  };

  const total = syncedCart.reduce((sum, item) => sum + safePrice(item.price) * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
      {syncedCart.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">Your cart is empty.</p>
          {backupCart.length > 0 && (
            <button
              onClick={handleRestoreCart}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Restore Cart
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {syncedCart.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.images?.[0] || '/placeholder.png'}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover border"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500">${safePrice(item.price).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch({ type: 'DECREASE_QUANTITY', payload: item.id })}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button
                  onClick={() => dispatch({ type: 'INCREASE_QUANTITY', payload: item.id })}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                  className="text-red-600 hover:text-red-800 ml-4 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
            <div className="flex gap-3">
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
              {backupCart.length > 0 && (
                <button
                  onClick={handleRestoreCart}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Restore Cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
