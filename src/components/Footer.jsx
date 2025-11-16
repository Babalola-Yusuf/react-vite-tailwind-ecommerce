// FILE: src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">MyStore</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Discover high-quality products, unbeatable deals, and seamless shopping experiences.
            Your satisfaction is our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/cart" className="hover:text-blue-400 transition">Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-blue-400 transition">Wishlist</Link></li>
            <li><Link to="/admin" className="hover:text-blue-400 transition">Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@mystore.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +1 (555) 234-5678
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-1" /> 123 Commerce St, New York, NY
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition">
              <Facebook size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-sky-400 transition">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-500 transition">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}