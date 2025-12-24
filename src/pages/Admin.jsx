// FILE: src/pages/Admin.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ProductContext from '../context/ProductContext';

export default function Admin() {
  const { state, dispatch } = useContext(ProductContext);
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const {categories} = state;
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    // images will be an array of strings (base64 or URLs)
    images: [],
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // temporary url input
  const [newCategory, setNewCategory] = useState('');
  const [highlightForm, setHighlightForm] = useState(false);


const handleAddCategory = () => {
  const name = newCategory.trim();
  if (!name) {
    toast.error('Category name cannot be empty');
    return;
  }

  dispatch({
    type: 'ADD_CATEGORY',
    payload: name,
  });

  setNewCategory('');
};


  // --- Helpers for file -> base64 conversion ---
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // Handle multiple file uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const converted = await Promise.all(files.map(fileToBase64));
      // append to existing product.images
      setProduct(prev => ({ ...prev, images: [...(prev.images || []), ...converted] }));
      toast.success(`Added ${converted.length} image(s)`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to read one or more files');
    }
    // reset input so same file can be reselected if needed
    e.target.value = '';
  };

  // Add single image via URL input
  const handleAddImageUrl = () => {
    const url = (imagePreviewUrl || '').trim();
    if (!url) return toast.error('Image URL cannot be empty');
    setProduct(prev => ({ ...prev, images: [...(prev.images || []), url] }));
    setImagePreviewUrl('');
    toast.success('Added image URL');
  };

  // Remove image at index from product.images
  const handleRemoveImage = (index) => {
    setProduct(prev => {
      const copy = [...(prev.images || [])];
      copy.splice(index, 1);
      return { ...prev, images: copy };
    });
  };

  // Submit (add or update)
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category) {
      return toast.error('Please fill in all required fields');
    }

    // prepare product payload
    const payload = {
      ...product,
      price: parseFloat(product.price),
      images: product.images?.filter(Boolean) || [],
    };

    if (editingProduct) {
      // ensure id is preserved
      payload.id = editingProduct.id;
      dispatch({ type: 'UPDATE_PRODUCT', payload });
      toast.success('Product updated successfully');
      setEditingProduct(null);
    } else {
      // create new product -- include id (reducer may also add)
      payload.id = Date.now();
      dispatch({ type: 'ADD_PRODUCT', payload });
      toast.success('Product added successfully');
    }

    // reset
    setProduct({ name: '', price: '', description: '', category: '', images: [] });
    setImagePreviewUrl('');
    // scroll to top (optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // edit handler
  const handleEditProduct = (p) => {
    setEditingProduct(p);
    // ensure product has images array
    setProduct({
      name: p.name || '',
      price: p.price || '',
      description: p.description || '',
      category: p.category || '',
      images: p.images?.length ? [...p.images] : p.image ? [p.image] : [],
      id: p.id,
    });
    setImagePreviewUrl(p.images?.[0] || p.image || '');

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nameInputRef.current?.focus();
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 1600);
    }, 180);
  };

  const handleDeleteProduct = (id) => {
    if (!confirm('Delete this product?')) return;
    dispatch({ type: 'REMOVE_PRODUCT', payload: id });
    toast.success('Product deleted');
  };

  // Small convenience: remove image when editing product saved (not required but helps)
  useEffect(() => {
    // if products changed externally and we were editing, refresh editing product reference
    if (editingProduct) {
      const refreshed = state.products.find(p => p.id === editingProduct.id);
      if (refreshed) setEditingProduct(refreshed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.products]);

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Add or Edit Product */}
      <form
        ref={formRef}
        onSubmit={handleAddProduct}
        className={`space-y-4 border-2 rounded-xl p-4 transition-all duration-500 ${highlightForm ? 'border-yellow-400 shadow-md shadow-yellow-100' : 'border-transparent'}`}
      >
        <h2 className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

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

        {/* Image inputs: url + file upload + previews */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-600 block mb-1">Image URL (add single)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste image URL and click Add"
                value={imagePreviewUrl}
                onChange={(e) => setImagePreviewUrl(e.target.value)}
                className="border rounded-lg p-3 w-full"
              />
              <button type="button" onClick={handleAddImageUrl} className="bg-indigo-600 text-white px-4 rounded">Add</button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Or upload multiple files below. Images are stored locally (base64).</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-gray-100 border px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              Upload images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* preview grid */}
        {product.images?.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative group border rounded overflow-hidden">
                <img src={img} alt={`preview-${idx}`} className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white px-2 py-1 rounded opacity-90 hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <select
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          className="border rounded-lg p-3 w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
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
                setProduct({ name: '', price: '', description: '', category: '', images: [] });
                setImagePreviewUrl('');
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
          <button onClick={handleAddCategory} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">Add Category</button>
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
              <div key={p.id} className="bg-gray-50 border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <img
                    src={(p.images && p.images[0]) || p.image || '/placeholder.png'}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.category}</p>
                  <p className="text-blue-600 font-bold">${p.price}</p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEditProduct(p)} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
