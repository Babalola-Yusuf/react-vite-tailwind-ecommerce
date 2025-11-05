// FILE: src/pages/Checkout.jsx
import React, { useContext, useState, useEffect } from 'react';
import CartContext from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { state, dispatch } = useContext(CartContext);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState({ items: [], total: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const navigate = useNavigate();

  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  /** Load saved billing info */
  useEffect(() => {
    const saved = localStorage.getItem('checkoutForm');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  /** Save form data as user types */
  useEffect(() => {
    localStorage.setItem('checkoutForm', JSON.stringify(formData));
  }, [formData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = e => {
    e.preventDefault();
    if (state.cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // ✅ Save snapshot before clearing cart
    setOrderData({ items: state.cart, total });
    setOrderConfirmed(true);
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('checkoutForm');
    toast.success('Payment successful! 🎉');
  };

  // ✅ Show confirmation
  if (orderConfirmed) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed ✅</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase! Your order summary is below:</p>
        <div className="border rounded-lg p-4 mb-6">
          {orderData.items.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-none">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-4 border-t mt-4">
            <span>Total</span>
            <span>${orderData.total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {state.cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty. Add some items before checking out.</p>
      ) : (
        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                required
                className="border rounded-lg p-3 w-full"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                required
                className="border rounded-lg p-3 w-full"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                placeholder="Address"
                required
                className="border rounded-lg p-3 w-full md:col-span-2"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                type="text"
                placeholder="City"
                required
                className="border rounded-lg p-3 w-full"
              />
              <input
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                type="text"
                placeholder="ZIP Code"
                required
                className="border rounded-lg p-3 w-full"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                type="text"
                placeholder="Card Number"
                required
                className="border rounded-lg p-3 w-full"
              />
              <input
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                type="text"
                placeholder="Name on Card"
                required
                className="border rounded-lg p-3 w-full"
              />
              <input
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                type="text"
                placeholder="Expiry Date (MM/YY)"
                required
                className="border rounded-lg p-3 w-full"
              />
              <input
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                type="text"
                placeholder="CVV"
                required
                className="border rounded-lg p-3 w-full"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4 mt-6">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'CLEAR_CART' });
                  toast('Cart cleared', { icon: '🧹' });
                }}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
              >
                Clear Cart
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Pay Now
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
