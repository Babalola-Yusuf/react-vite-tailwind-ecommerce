import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductContext from '../context/ProductContext';
import WishlistContext from '../context/WishlistContext';

export default function Home() {
  const { state } = useContext(ProductContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext) || { wishlist: [], toggleWishlist: () => {} };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive categories dynamically from products
  const categories = ['All', ...new Set(state.products.map(p => p.category || 'Uncategorized'))];

  // Filtered product list
  const filteredProducts = state.products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Category Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full md:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const isInWishlist = wishlist?.some(item => item.id === product.id);

            return (
              <div key={product.id} className="relative bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition">
                {/* Wishlist Heart Icon */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500 mt-1">{product.category || 'Uncategorized'}</p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
