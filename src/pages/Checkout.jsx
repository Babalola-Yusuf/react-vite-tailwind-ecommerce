// FILE: src/pages/Checkout.jsx
import React, { useContext, useState, useEffect } from 'react';
import CartContext from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { state, dispatch } = useContext(CartContext);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState({ items: [], total: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

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

  /** Save as user types */
  useEffect(() => {
    localStorage.setItem('checkoutForm', JSON.stringify(formData));
  }, [formData]);

  /** === Formatters === */

  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length < 3) return cleaned;
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  };

  const formatCVV = (value) => value.replace(/\D/g, "").slice(0, 3);

  /** Input handler */
  const handleChange = (e) => {
    const { name, value } = e.target;

    let formatted = value;
    if (name === "cardNumber") formatted = formatCardNumber(value);
    if (name === "expiry") formatted = formatExpiry(value);
    if (name === "cvv") formatted = formatCVV(value);

    setFormData((prev) => ({ ...prev, [name]: formatted }));
  };

  /** Payment Submission */
  const handlePayment = (e) => {
    e.preventDefault();
    if (state.cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setOrderData({ items: state.cart, total });
    setOrderConfirmed(true);
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("checkoutForm");
    toast.success("Payment successful! 🎉");
  };

  /** === Order Confirmation Page === */
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

  /** ====================== CHECKOUT PAGE ====================== */
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {state.cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty. Add some items before checking out.</p>
      ) : (
        <form onSubmit={handlePayment} className="space-y-8">

          {/* ========== BILLING INFORMATION ========== */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleChange} type="text"
                placeholder="Full Name" required className="border rounded-lg p-3 w-full" />

              <input name="email" value={formData.email} onChange={handleChange} type="email"
                placeholder="Email Address" required className="border rounded-lg p-3 w-full" />

              <input name="address" value={formData.address} onChange={handleChange} type="text"
                placeholder="Address" required className="border rounded-lg p-3 w-full md:col-span-2" />

              <input name="city" value={formData.city} onChange={handleChange} type="text"
                placeholder="City" required className="border rounded-lg p-3 w-full" />

              <input name="zip" value={formData.zip} onChange={handleChange} type="text"
                placeholder="ZIP Code" required className="border rounded-lg p-3 w-full" />
            </div>
          </section>

          {/* ========== PAYMENT SECTION ========== */}
          <section className="bg-gray-50 border rounded-xl shadow-inner p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Details
              </h2>

              <div className="flex gap-2 opacity-70">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mastercard-logo.png" className="h-5" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/American_Express_logo.svg" className="h-5" />
              </div>
            </div>

            {/* ========== CREDIT CARD PREVIEW ========== */}
<div className="flex justify-center mb-6">
  <motion.div
    className="relative"
    style={{
      width: "340px",
      height: "210px",
      perspective: "1000px",
      transformStyle: "preserve-3d",
    }}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ duration: 0.6 }}
  >
    {/* FRONT OF CARD */}
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        backfaceVisibility: "hidden",
      }}
      className="bg-gradient-to-br from-blue-700 to-blue-400 text-white shadow-2xl p-6 flex flex-col justify-between"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold tracking-wide">MyStore</span>

        {formData.cardNumber.startsWith("4") && (
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6" />
        )}
        {formData.cardNumber.startsWith("5") && (
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mastercard-logo.png" className="h-6" />
        )}
        {formData.cardNumber.startsWith("3") && (
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/American_Express_logo.svg" className="h-6" />
        )}
      </div>

      <p className="text-xl tracking-widest font-mono mt-4">
        {formData.cardNumber || "•••• •••• •••• ••••"}
      </p>

      <div className="flex justify-between text-sm tracking-wide mt-3">
        <span>{formData.cardName || "CARDHOLDER NAME"}</span>
        <span>{formData.expiry || "MM/YY"}</span>
      </div>
    </div>

    {/* BACK OF CARD */}
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
      className="bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-2xl p-6"
    >
      <div className="bg-black h-12 w-full mb-6"></div>

      <div className="flex justify-end pr-3 mt-4">
        <div className="bg-white text-black rounded px-3 py-2 font-mono tracking-widest">
          {formData.cvv || "•••"}
        </div>
      </div>
    </div>
  </motion.div>
</div>

            {/* ========== CARD INPUTS ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="Card Number"
                maxLength={19}
                required
                className="border rounded-lg p-3 w-full"
                onFocus={() => setIsFlipped(false)}
              />

              <input
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="Name on Card"
                required
                className="border rounded-lg p-3 w-full"
                onFocus={() => setIsFlipped(false)}
              />

              <input
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength={5}
                required
                className="border rounded-lg p-3 w-full"
                onFocus={() => setIsFlipped(false)}
              />

              <input
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                maxLength={3}
                required
                className="border rounded-lg p-3 w-full"
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}   // ⭐ FIX — ensures CVV shows!
              />
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
              <Lock className="w-4 h-4" />
              <span>Secure 256-bit encrypted payment</span>
            </div>
          </section>

          {/* ========== FOOTER BUTTONS ========== */}
          <div className="flex justify-between items-center border-t pt-4 mt-6">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "CLEAR_CART" });
                  toast("Cart cleared", { icon: "🧹" });
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
