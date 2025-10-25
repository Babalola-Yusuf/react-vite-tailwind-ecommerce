// FILE: src/pages/Admin.jsx
import React, { useState, useContext } from 'react';
import ProductContext from '../context/ProductContext';

export default function Admin() {
  const { dispatch, state } = useContext(ProductContext);
  const [form, setForm] = useState({ name: '', price: '', description: '' });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const newProduct = {
      id: Date.now(),
      ...form,
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    setForm({ name: '', price: '', description: '' });
  };

  const handleDelete = id => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow-md max-w-md">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Product
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Current Products</h2>
      {state.products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <ul className="space-y-2">
          {state.products.map(p => (
            <li key={p.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
              <span>{p.name} - ${p.price}</span>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
