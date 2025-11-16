// FILE: src/pages/Admin.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ProductContext from '../context/ProductContext';

export default function Admin() {
  const { state, dispatch } = useContext(ProductContext);
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [highlightForm, setHighlightForm] = useState(false);
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem('categories')) || ['Electronics', 'Clothing', 'Accessories']
  );

  // Save categories persistently
  const updateCategories = (updated) => {
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return toast.error('Category name cannot be empty');
    if (categories.includes(newCategory.trim())) return toast.error('Category already exists');
    const updated = [...categories, newCategory.trim()];
    updateCategories(updated);
    toast.success(`Added category "${newCategory}"`);
    setNewCategory('');
  };

 // Handle image upload (Base64)
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setProduct({ ...product, image: base64String });
    };
    reader.readAsDataURL(file);
  }
};


  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category)
      return toast.error('Please fill in all required fields');

    if (editingProduct) {
      // Update existing product
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: { ...product, id: editingProduct.id, images: [product.image] },
      });
      toast.success('Product updated successfully');
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct = {
        ...product,
        price: parseFloat(product.price),
        id: Date.now(),
        images: [product.image],
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast.success('Product added successfully');
    }

    setProduct({ name: '', price: '', description: '', image: '', category: '' });
    setImagePreview('');
  };

  const handleEditProduct = (p) => {
    setEditingProduct(p);
    setProduct(p);
    setImagePreview(p.image || p.images?.[0] || '');

    // Smooth scroll and highlight form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nameInputRef.current?.focus();
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }, 200);
  };

  const handleDeleteProduct = (id) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: id });
    toast.success('Product deleted');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Add or Edit Product */}
      <form
        ref={formRef}
        onSubmit={handleAddProduct}
        className={`space-y-4 border-2 rounded-xl p-4 transition-all duration-500 ${
          highlightForm ? 'border-yellow-400 shadow-md shadow-yellow-100' : 'border-transparent'
        }`}
      >
        <h2 className="text-xl font-semibold">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>

        <input
          ref={nameInputRef}
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          className="border rounded-lg p-3 w-full"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          className="border rounded-lg p-3 w-full"
          required
        />

        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          className="border rounded-lg p-3 w-full"
        />

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={product.image}
              onChange={(e) => {
                setProduct({ ...product, image: e.target.value });
                setImagePreview(e.target.value);
              }}
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded border"
              />
            )}
          </div>
        </div>

        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="border rounded-lg p-3 w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {editingProduct ? 'Save Changes' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setProduct({ name: '', price: '', description: '', image: '', category: '' });
                setImagePreview('');
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Add Category */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border rounded-lg p-3 w-full"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        {state.products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.products.map((p) => (
              <div
                key={p.id}
                className="bg-gray-50 border rounded-lg p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={p.image || p.images?.[0] || '/placeholder.png'}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.category}</p>
                  <p className="text-blue-600 font-bold">${p.price}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEditProduct(p)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
