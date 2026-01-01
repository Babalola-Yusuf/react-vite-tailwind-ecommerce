// FILE: src/pages/Homepage.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductContext from "../context/ProductContext";
import WishlistContext from "../context/WishlistContext";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";


// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Home() {
  const { state } = useContext(ProductContext);
  const { wishlist, toggleWishlist } =
    useContext(WishlistContext) || { wishlist: [], toggleWishlist: () => {} };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const closeFiltersOnMobile = () => {
  if (window.innerWidth < 1024) {
    setShowFilters(false);
  }
};

  const prices = state.products.map(p => Number(p.price) || 0);

  const minProductPrice = prices.length ? Math.min(...prices) : 0;
  const maxProductPrice = prices.length ? Math.max(...prices) : 0;


  const categories = [
    "All",
    ...new Set(state.products.map((p) => p.category || "Uncategorized")),
  ];
  const hasEnoughFeaturedSlides = state.products.length >= 4;

  const filteredProducts = state.products.filter((p) => {
  const price = Number(p.price);

  const matchesCategory =
    selectedCategory === "All" || p.category === selectedCategory;

  const matchesSearch = p.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesMinPrice =
    minPrice === "" || price >= Number(minPrice);

  const matchesMaxPrice =
    maxPrice === "" || price <= Number(maxPrice);

  return (
    matchesCategory &&
    matchesSearch &&
    matchesMinPrice &&
    matchesMaxPrice
  );
});


  return (
    <div className="space-y-10">
{/* ===========================
    HERO CAROUSEL
============================ */}
<div className="rounded-xl overflow-hidden shadow-lg">
  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    autoplay={{ delay: 3000 }}
    pagination={{ clickable: true }}
    navigation
    loop
    slidesPerView={1}
  >
    {/* SLIDE 1 */}
    <SwiperSlide>
      <div
        className="relative h-64 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero1})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Welcome to MyStore
          </h1>
          <p className="mt-3 text-white/90 max-w-xl">
            Discover premium products curated just for you
          </p>
        </div>
      </div>
    </SwiperSlide>

    {/* SLIDE 2 */}
    <SwiperSlide>
      <div
        className="relative h-64 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero2})`}}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Best Deals of the Season
          </h1>
          <p className="mt-3 text-white/90 max-w-xl">
            Save more with exclusive offers and discounts
          </p>
        </div>
      </div>
    </SwiperSlide>

    {/* SLIDE 3 */}
    <SwiperSlide>
      <div
        className="relative h-64 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero3})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Shop the Latest Products
          </h1>
          <p className="mt-3 text-white/90 max-w-xl">
            Stay ahead with our newest arrivals...
          </p>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</div>


      {/* ===========================
          FEATURED PRODUCTS CAROUSEL
      ============================ */}
      {state.products.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>

        <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={hasEnoughFeaturedSlides}
        autoplay={hasEnoughFeaturedSlides ? { delay: 2500 } : false}
        pagination={{ clickable: true }}
        navigation={hasEnoughFeaturedSlides}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >

            {state.products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="relative bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      wishlist?.some((w) => w.id === product.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>

                  <Link to={`/product/${product.id}`}>
                    <img
                      src={
                        (product.images && product.images[0]) ||
                        product.image ||
                        "/placeholder.png"
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
{/* Mobile filter toggle */}
<div className="lg:hidden flex justify-between items-center">
  <button
    onClick={() => setShowFilters(true)}
    className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
  >
    Filters
  </button>

  <span className="text-sm text-gray-500">
    {filteredProducts.length} items
  </span>
</div>

{/* ===========================
    FILTER + PRODUCTS LAYOUT
=========================== */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  {/* Mobile backdrop */}
{showFilters && (
  <div
    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
    onClick={() => setShowFilters(false)}
  />
)}

{/* FILTER SIDEBAR */}
<aside
  className={`
    lg:col-span-1 bg-white border rounded-xl p-5 space-y-6
    lg:sticky lg:top-24
    fixed lg:static top-0 left-0 h-full lg:h-fit w-80 lg:w-auto
    z-40
    transform transition-transform duration-300
    ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
>
{/* Mobile close */}
<div className="flex justify-between items-center lg:hidden">
  <h3 className="font-semibold">Filters</h3>
  <button
    onClick={() => setShowFilters(false)}
    className="text-sm text-gray-500"
  >
    ✕
  </button>
</div>

  {/* Search */}
  <div>
    <h3 className="font-semibold mb-2">Search</h3>
<input
  type="text"
  placeholder="Search products..."
  className="border p-2 rounded w-full"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      closeFiltersOnMobile();
    }
  }}
/>

  </div>

  {/* Categories */}
<fieldset>
  <legend className="font-semibold mb-3">Categories</legend>

  <div className="space-y-2">
    {categories.map((cat, index) => {
      const id = `category-${index}`;

      return (
        <div key={cat} className="flex items-center gap-2">
          <input
            id={id}
            type="radio"
            name="category"
            value={cat}
            checked={selectedCategory === cat}
           onChange={() => {
  setSelectedCategory(cat);
  closeFiltersOnMobile();
}}

            className="accent-blue-600"
          />

          <label
            htmlFor={id}
            className="text-sm cursor-pointer select-none"
          >
            {cat}
          </label>
        </div>
      );
    })}
  </div>
</fieldset>

{/* Price Filter */}
<div>
  <h3 className="font-semibold mb-3">Price (₦)</h3>

  {/* Price Range Display */}
  <div className="flex justify-between text-sm text-gray-600 mb-2">
    <span>₦{minPrice || minProductPrice}</span>
    <span>₦{maxPrice || maxProductPrice}</span>
  </div>

  {/* Slider */}
<input
  type="range"
  min={minProductPrice}
  max={maxProductPrice}
  value={maxPrice || maxProductPrice}
  onChange={(e) => {
    setMaxPrice(e.target.value);
    closeFiltersOnMobile();
  }}
  className="w-full accent-blue-600"
/>


  {/* Inputs */}
  <div className="flex gap-2 mt-3">
    <input
      type="number"
      placeholder="Min"
      className="border p-2 rounded w-full"
      value={minPrice}
      min={minProductPrice}
      onChange={(e) => {
  setMinPrice(e.target.value);
  closeFiltersOnMobile();
}}

    />
    <input
      type="number"
      placeholder="Max"
      className="border p-2 rounded w-full"
      value={maxPrice}
      max={maxProductPrice}
      onChange={(e) => {
  setMaxPrice(e.target.value);
  closeFiltersOnMobile();
}}

    />
  </div>
</div>


  {/* Reset */}
  <button
    onClick={() => {
      setSearchTerm("");
      setSelectedCategory("All");
      setMinPrice("");
      setMaxPrice("");
    }}
    className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 transition text-sm"
  >
    Clear Filters
  </button>
</aside>

      {/* ===========================
          PRODUCT GRID
      ============================ */}
      <div className="lg:col-span-3">
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No products found.</p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isInWishlist = wishlist?.some(
              (item) => item.id === product.id
            );

            return (
              <div
                key={product.id}
                className="relative bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition"
              >
                <button
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
  }}
  className={`absolute top-2 right-2 p-2 rounded-full ${
    isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
  }`}
>
  <Heart className="w-5 h-5" />
</button>

                <Link to={`/product/${product.id}`}>
                  <img
                    src={
                      (product.images && product.images[0]) ||
                      product.image ||
                      "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.category || "Uncategorized"}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
</div>
    </div>
  );
}