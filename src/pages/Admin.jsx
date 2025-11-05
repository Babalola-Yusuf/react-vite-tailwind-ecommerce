// FILE: src/pages/Admin.jsx
import React, { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductContext from '../context/ProductContext';

export default function Admin() {
  const { state, dispatch } = useContext(ProductContext);
  const [form, setForm] = useState({ id: null, name: '', price: '', description: '', imageUrl: '' });
  const [previewList, setPreviewList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedData = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedData);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      compressImage(file, compressed => {
        setPreviewList(prev => [...prev, compressed]);
      });
    });
  };

  const removePreview = index => {
    setPreviewList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const imageSources = [...previewList, ...(form.imageUrl ? [form.imageUrl] : [])];

    if (editingId) {
      const updatedProduct = { ...form, id: editingId, images: imageSources };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      toast.success('✅ Product updated successfully!');
      setEditingId(null);
    } else {
      const newProduct = { ...form, id: Date.now(), images: imageSources };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      toast.success('🛒 Product added successfully!');
    }

    setForm({ id: null, name: '', price: '', description: '', imageUrl: '' });
    setPreviewList([]);
  };

  const handleEdit = id => {
    const product = state.products.find(p => p.id === id);
    if (!product) return;
    setForm({ id: product.id, name: product.name, price: product.price, description: product.description, imageUrl: product.images?.[0] || '' });
    setPreviewList(product.images || []);
    setEditingId(product.id);
    toast.info('✏️ Editing product...');
  };

  const handleDelete = id => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'REMOVE_PRODUCT', payload: id });
      toast.error('🗑️ Product deleted successfully!');
    }
  };

  const clearAllProducts = () => {
    if (confirm('Are you sure you want to clear all products?')) {
      dispatch({ type: 'CLEAR_PRODUCTS' });
      toast.warn('🧹 All products cleared!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-lg">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Price ($)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Upload Images (from PC)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Or Enter Image URL</label>
          <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="https://example.com/product.jpg" />
        </div>

        {(previewList.length > 0 || form.imageUrl) && (
          <div className="flex flex-wrap gap-3 mt-2 border-t pt-3">
            {previewList.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-lg border" />
                <button type="button" onClick={() => removePreview(index)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
            {form.imageUrl && !previewList.includes(form.imageUrl) && (
              <img src={form.imageUrl} alt="URL Preview" className="h-24 w-24 object-cover rounded-lg border" />
            )}
          </div>
        )}

        <button type="submit" className={`w-full py-2 rounded-lg text-white ${editingId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="flex justify-end mb-4">
        <button onClick={clearAllProducts} className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">Clear All Products</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Product List</h2>
        {state.products.length === 0 ? (
          <p className="text-gray-600">No products added yet.</p>
        ) : (
          <div className="space-y-4">
            {state.products.map(product => (
              <div key={product.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-4">
                  <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="h-16 w-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-700">${product.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product.id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
