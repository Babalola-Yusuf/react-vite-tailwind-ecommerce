// FILE: src/pages/ProductDetails.jsx
import React, { useContext, useState, useMemo } from 'react';
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
  const wishlistContext = useContext(WishlistContext) || {};
  const { state: wishlistState = {}, toggleWishlist } = wishlistContext;

  const product = productState.products.find(p => p.id === Number(id));

  const images = useMemo(() => {
    // normalize: support product.images (array) or product.image (single)
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return [];
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) {
    return <div className="text-center mt-20 text-xl">Product not found.</div>;
  }

  const isWishlisted = (wishlistState?.wishlist || []).some(item => item.id === product.id);

  const handleAddToCart = () => {
    cartDispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (typeof toggleWishlist === 'function') {
      toggleWishlist(product);
      toast(isWishlisted ? 'Removed from wishlist 💔' : 'Added to wishlist ❤️');
    } else {
      toast.error('Wishlist not available');
    }
  };

  const mainImage = images[activeIndex] || '/placeholder.png';
  const heroBg = images[0] || '/placeholder.png';

  return (
    <div className="w-full">
      {/* Hero section */}
      <div
        className="w-full relative h-64 md:h-80 rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* blurred overlay */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl w-full px-4">
          <div className="text-white">
            <h1 className="text-2xl md:text-4xl font-bold">{product.name}</h1>
            <p className="mt-2 text-sm md:text-base max-w-2xl">{product.description}</p>
          </div>
        </div>
      </div>

      {/* product content */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-lg -mt-12 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: images */}
          <div className="w-full md:w-1/2">
            <div className="border rounded-lg overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-80 object-cover" />
            </div>

            {/* thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex-none border rounded overflow-hidden ${idx === activeIndex ? 'ring-2 ring-indigo-400' : ''}`}
                    style={{ width: 72, height: 72 }}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <h2 className="text-3xl font-bold">{product.name}</h2>

                <button
                  onClick={handleToggleWishlist}
                  className="p-2 text-red-500 hover:text-red-700 transition"
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className="w-6 h-6" fill={isWishlisted ? 'red' : 'none'} strokeWidth={2} />
                </button>
              </div>

              <p className="text-gray-700 mt-4">{product.description}</p>

              <div className="mt-4">
                <span className="text-2xl font-semibold text-blue-600">${product.price}</span>
              </div>

              {product.category && (
                <p className="text-sm text-gray-500 mt-3">Category: <span className="font-medium">{product.category}</span></p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Add to Cart
              </button>

              <button
                        onClick={() => {
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch {
            window.scrollTo(0, 0);
          }
        }}
                className="bg-gray-100 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-200 transition"
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
