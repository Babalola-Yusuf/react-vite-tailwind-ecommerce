// FILE: src/pages/Admin.jsx
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import ProductContext from '../context/ProductContext';

export default function Admin() {
  const { state, dispatch } = useContext(ProductContext);

  const [product, setProduct] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
  });

  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem('categories')) || ['Electronics', 'Clothing', 'Accessories']
  );

  // Persist category list
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

  // ✅ Handle image uploads (from PC)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProduct({ ...product, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Add or Update Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category)
      return toast.error('Please fill in all required fields');

    if (editing) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
      toast.success('Product updated successfully');
    } else {
      dispatch({
        type: 'ADD_PRODUCT',
        payload: { ...product, id: Date.now(), price: parseFloat(product.price) },
      });
      toast.success('Product added successfully');
    }

    setProduct({ id: null, name: '', price: '', description: '', image: '', category: '' });
    setPreview(null);
    setEditing(false);
  };

  // ✅ Edit existing product
  const handleEditProduct = (p) => {
    setProduct(p);
    setPreview(p.image);
    setEditing(true);
  };

  const handleDeleteProduct = (id) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: id });
    toast.success('Product deleted');
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setProduct({ id: null, name: '', price: '', description: '', image: '', category: '' });
    setPreview(null);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Add / Edit Product */}
      <form onSubmit={handleSaveProduct} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {editing ? 'Edit Product' : 'Add New Product'}
        </h2>

        <input
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

        {/* Local image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border rounded-lg p-3 w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
        )}

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

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {editing ? 'Update Product' : 'Add Product'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
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
                    src={p.image || '/placeholder.png'}
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
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
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
