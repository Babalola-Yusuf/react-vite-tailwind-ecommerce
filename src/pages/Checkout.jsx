// FILE: src/pages/Checkout.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import CartContext from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

/*
  Minimal inline comments only for reasoning. File replaces the existing Checkout.jsx.
*/

export default function Checkout() {
  const { state, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  // UX states
  const [loading, setLoading] = useState(true); // initial page skeleton
  const [processing, setProcessing] = useState(false); // payment skeleton
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState({ items: [], total: 0 });

  // card preview
  const [isFlipped, setIsFlipped] = useState(false);
  const controls = useAnimation();
  const cardRef = useRef(null);

  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [brand, setBrand] = useState(""); // brand key
  const [isLuhnValid, setIsLuhnValid] = useState(null);

  /* -------------------- Persist & initial skeleton -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("checkoutForm");
    if (saved) setFormData(JSON.parse(saved));
    const t = setTimeout(() => setLoading(false), 1000); // page skeleton for 1s
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formData));
  }, [formData]);

  /* -------------------- Helpers (formatters, validators) -------------------- */
  const digitsOnly = (s = "") => s.replace(/\D/g, "");

  const formatCardNumber = (raw) =>
    digitsOnly(raw).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  const formatExpiry = (raw) => {
    const d = digitsOnly(raw).slice(0, 4);
    if (d.length < 3) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const formatCVV = (raw) => digitsOnly(raw).slice(0, 3);

  /* -------------------- Provided regexes (use exactly as requested) -------------------- */
  const re = {
    visa: /^4[0-9]{12}(?:[0-9]{3,4})?$/,
    visa_local: /^4[19658][7684][0785][04278][128579](?:[0-9]{10})$/,
    mastercard:
      /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
    mastercard_local:
      /^(?:5[13]99|55[35][19]|514[36])(?:11|4[10]|23|83|88)(?:[0-9]{10})$/,
    verve: /^(?:50[067][180]|6500)(?:[0-9]{15})$/,
    american_exp: /^3[47](?:[0-9]{13})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    maestro:
      /^(5899|5018|5020|5038|6304|6703|6708|6759|676[1-3])[06][19](?:[0-9]{10})$/,
    discover: /^6(?:011|4[4-9]3|222|5[0-9]{2})[0-9]{12}$/,
    laser: /^(6706|6771|6709)[0-9]{11,15}$/,
    hipercard: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  };

  /* -------------------- Brand mapping (generic URLs) -------------------- */
  const brandLogos = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    american_exp:
      "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
    discover: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg",
    jcb: "https://upload.wikimedia.org/wikipedia/commons/0/0b/JCB_logo.svg",
    diners_club: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Diners_Club_Logo3.svg",
    verve: "https://upload.wikimedia.org/wikipedia/commons/8/89/Generic_credit_card_icon.svg",
    maestro: "https://upload.wikimedia.org/wikipedia/commons/0/04/Maestro_2016.svg",
    laser: "https://upload.wikimedia.org/wikipedia/commons/8/89/Generic_credit_card_icon.svg",
    hipercard: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Hipercard_logo.svg",
    generic: "https://upload.wikimedia.org/wikipedia/commons/8/89/Generic_credit_card_icon.svg",
  };

  /* -------------------- Combined brand detection:
     * 1) Try each provided regex against raw digits (this is exact / strict).
     * 2) If none match, fall back to simple detection (startsWith) so we keep prior behavior.
     * 3) Map visa_local -> visa & mastercard_local -> mastercard for logo reuse.
     * -------------------------------------------------------------------------- */
  const detectBrandAdvanced = (rawDigits) => {
    if (!rawDigits) return "";
    // check strict regex first
    if (re.visa.test(rawDigits) || re.visa_local.test(rawDigits)) return "visa";
    if (re.mastercard.test(rawDigits) || re.mastercard_local.test(rawDigits)) return "mastercard";
    if (re.american_exp.test(rawDigits)) return "american_exp";
    if (re.discover.test(rawDigits)) return "discover";
    if (re.jcb.test(rawDigits)) return "jcb";
    if (re.diners_club.test(rawDigits)) return "diners_club";
    if (re.verve.test(rawDigits)) return "verve";
    if (re.maestro.test(rawDigits)) return "maestro";
    if (re.laser.test(rawDigits)) return "laser";
    if (re.hipercard.test(rawDigits)) return "hipercard";
    // fallback simpler checks (keeps your older logic)
    if (rawDigits.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(rawDigits)) return "mastercard";
    if (/^3[47]/.test(rawDigits)) return "american_exp";
    return "";
  };

  /* -------------------- Luhn (same as before) -------------------- */
  const luhnCheck = (rawDigits) => {
    const s = rawDigits;
    if (s.length < 12) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let digit = parseInt(s.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  useEffect(() => {
    const raw = digitsOnly(formData.cardNumber);
    const brandDetected = detectBrandAdvanced(raw);
    setBrand(brandDetected);
    if (raw.length >= 12) setIsLuhnValid(luhnCheck(raw));
    else setIsLuhnValid(null);
  }, [formData.cardNumber]);

  /* -------------------- Inputs / interactions -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cardNumber") v = formatCardNumber(value);
    if (name === "expiry") v = formatExpiry(value);
    if (name === "cvv") v = formatCVV(value);
    setFormData((p) => ({ ...p, [name]: v }));
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    controls.start({
      rotateX: Math.max(Math.min(-dy / 20, 10), -10),
      rotateY: Math.max(Math.min(dx / 20, 10), -10),
      transition: { duration: 0.18 },
    });
  };

  const handleMouseLeave = () => {
    controls.start({ rotateX: 0, rotateY: 0, transition: { duration: 0.3 } });
  };

  /* -------------------- Payment submission -------------------- */
  const handlePayment = async (e) => {
    e.preventDefault();
    if (state.cart.length === 0) return toast.error("Your cart is empty!");
    if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv)
      return toast.error("Complete card details");
    if (isLuhnValid === false) return toast.error("Card number appears invalid");

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate processing
    setOrderData({ items: state.cart, total });
    setOrderConfirmed(true);
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("checkoutForm");
    setProcessing(false);
    toast.success("Payment successful 🎉");
  };

  const formattedCard = formData.cardNumber || "•••• •••• •••• ••••";
  const showSkeleton = loading || processing;
  const logoUrl = brandLogos[brand] || brandLogos.generic;

  /* -------------------- Small spinner used during processing -------------------- */
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );

  /* -------------------- Render -------------------- */
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {orderConfirmed ? (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-green-600">Order Confirmed ✅</h2>
          <p className="text-gray-700 mt-2">Thank you for your purchase. Summary:</p>

          <div className="mt-4 border rounded-lg p-4 bg-white">
            {orderData.items.map((it) => (
              <div key={it.id} className="flex justify-between py-2 border-b last:border-b-0">
                <span>{it.name} x{it.quantity}</span>
                <span>${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-3 mt-3 border-t">
              <span>Total</span>
              <span>${orderData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">
              Continue Shopping
            </button>
          </div>
        </div>
      ) : showSkeleton ? (
        /* Glassmorphic skeleton (animate-pulse) */
        <div className="space-y-6">
          <div className="rounded-xl bg-white/30 backdrop-blur-md border border-white/20 p-5 animate-pulse">
            <div className="h-6 w-44 bg-white/40 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-10 bg-white/30 rounded" />
              <div className="h-10 bg-white/30 rounded" />
              <div className="h-10 bg-white/30 rounded md:col-span-2" />
              <div className="h-10 bg-white/30 rounded" />
              <div className="h-10 bg-white/30 rounded" />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[330px] h-[200px] rounded-xl bg-white/20 border border-white/20 backdrop-blur-md animate-pulse shadow-lg"></div>
          </div>

          <div className="rounded-xl bg-white/30 backdrop-blur-md border border-white/20 p-5 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-10 bg-white/30 rounded" />
              <div className="h-10 bg-white/30 rounded" />
              <div className="h-10 bg-white/30 rounded" />
              <div className="h-10 bg-white/30 rounded" />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="h-8 w-32 bg-white/30 rounded" />
              <div className="flex gap-3">
                <div className="h-10 w-24 bg-white/30 rounded" />
                <div className="h-10 w-24 bg-white/30 rounded" />
              </div>
            </div>
          </div>

          {/* processing overlay */}
          {processing && (
            <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="bg-black/40 p-6 rounded-lg text-white backdrop-blur-sm flex items-center gap-3">
                <Spinner /> Processing payment...
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Real UI */
        <form onSubmit={handlePayment} className="space-y-8">
          {/* Billing */}
          <section className="bg-white shadow-lg rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border rounded p-3"
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border rounded p-3"
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="border rounded p-3 md:col-span-2"
              />
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="border rounded p-3"
              />
              <input
                name="zip"
                placeholder="ZIP Code"
                value={formData.zip}
                onChange={handleChange}
                required
                className="border rounded p-3"
              />
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white shadow-lg rounded-xl p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Details
              </h2>
              <div className="flex gap-2 opacity-80">
                <img alt="visa" src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-5" />
                <img alt="mc" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" />
                <img alt="amex" src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" className="h-5" />
              </div>
            </div>

            {/* Card preview (tilt outer, flip inner) */}
            <div className="flex justify-center mt-4">
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={controls}
                className="relative"
                style={{ width: 330, height: 200, perspective: 1200 }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* front */}
                  <div
                    className="absolute inset-0 rounded-xl p-5 shadow-xl"
                    style={{
                      backfaceVisibility: "hidden",
                      background: "linear-gradient(135deg,#1e40af,#3b82f6)",
                      color: "white",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">MyStore</span>
                      <div className="flex items-center gap-2">
                        <img alt="brand" src={logoUrl} className="h-6" />
                      </div>
                    </div>

                    <p className="text-xl tracking-widest font-mono mt-6">{formattedCard}</p>

                    <div className="flex justify-between text-sm mt-3">
                      <span>{formData.cardName || "CARDHOLDER"}</span>
                      <span>{formData.expiry || "MM/YY"}</span>
                    </div>
                  </div>

                  {/* back */}
                  <div
                    className="absolute inset-0 rounded-xl p-5"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "linear-gradient(135deg,#111827,#4b5563)",
                      color: "white",
                    }}
                  >
                    <div className="bg-black h-10 w-full mb-6 rounded-sm" />
                    <div className="flex justify-end pr-3">
                      <div className="bg-white text-black font-mono px-3 py-2 rounded tracking-widest">
                        {formData.cvv || "•••"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <input
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                onFocus={() => setIsFlipped(false)}
                placeholder="Card Number"
                maxLength={19}
                required
                className="border rounded p-3"
              />

              <input
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                onFocus={() => setIsFlipped(false)}
                placeholder="Name on Card"
                required
                className="border rounded p-3"
              />

              <input
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                onFocus={() => setIsFlipped(false)}
                placeholder="MM/YY"
                maxLength={5}
                required
                className="border rounded p-3"
              />

              <input
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                placeholder="CVV"
                maxLength={3}
                required
                className="border rounded p-3"
              />
            </div>
          </section>

          {/* actions */}
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "CLEAR_CART" });
                  toast("Cart cleared", { icon: "🧹" });
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                disabled={processing}
              >
                Clear Cart
              </button>

              <button
                type="submit"
                disabled={processing}
                className={`px-6 py-2 rounded text-white flex items-center gap-2 ${processing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {processing ? <><Spinner /> Processing...</> : "Pay Now"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
