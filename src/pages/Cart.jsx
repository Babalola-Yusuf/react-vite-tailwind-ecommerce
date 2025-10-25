// FILE: src/pages/Cart.jsx
import React, { useContext } from 'react';
import CartContext from '../context/CartContext';

export default function Cart() {
  const { state, dispatch } = useContext(CartContext);
  const total = state.cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {state.cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {state.cart.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>${item.price}</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center border-t pt-4">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}