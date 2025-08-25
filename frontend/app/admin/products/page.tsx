'use client';

import React, { useEffect, useState } from 'react';
import { Product, ProductInput } from '@/lib/types/products';
import { ProductsClass } from '@/lib/httpClient/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    price: 0,
    image: '',
    description: '',
    inventory: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await ProductsClass.getAllProducts(page, limit);
      setProducts(res.products);
      setTotalPage(res.totalPage);
    } catch (e) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    if (name === 'price') {
      const parsed = parseFloat(value);
      setFormData((prev) => ({ ...prev, price: isNaN(parsed) ? 0 : parsed }));
    } else if (name === 'inventory') {
      const parsed = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, inventory: isNaN(parsed) ? 0 : parsed }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await ProductsClass.updateProduct(editingId, formData);
      } else {
        await ProductsClass.createProduct(formData);
      }
      setFormData({
        name: '',
        price: 0,
        image: '',
        description: '',
        inventory: 0,
      });
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: Number(product.price),
      image: product?.image || '',
      description: product.description || '',
      inventory: Number(product.inventory),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    setError(null);
    try {
      await ProductsClass.deleteProduct(id);
      fetchProducts();
    } catch (e) {
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white-100 rounded-lg shadow-md">
      <h1 className="text-h1 font-extrabold text-blue-500 mb-10 text-center">Admin Products</h1>
      {error && (
        <p className="text-red-600 bg-white-400 p-3 rounded-md max-w-xl mx-auto mb-6 text-center shadow-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 mb-12 md:grid-cols-2 max-w-5xl mx-auto">

        {/* Product Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-semibold text-blue-600">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="p-3 border border-blue-500 rounded-md text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="mb-2 font-semibold text-blue-600">
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleInputChange}
            min={0}
            step="0.01"
            required
            className="p-3 border border-blue-500 rounded-md text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="description" className="mb-2 font-semibold text-blue-600">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleInputChange}
            className="p-3 border border-blue-500 rounded-md text-lg resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={4}
          />
        </div>

        {/* Inventory */}
        <div className="flex flex-col">
          <label htmlFor="inventory" className="mb-2 font-semibold text-blue-600">
            Inventory
          </label>
          <input
            id="inventory"
            name="inventory"
            type="number"
            placeholder="Enter inventory count"
            value={formData.inventory}
            onChange={handleInputChange}
            min={0}
            required
            className="p-3 border border-blue-500 rounded-md text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="image" className="mb-2 font-semibold text-blue-600">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            placeholder="Enter image URL"
            value={formData.image}
            onChange={handleInputChange}
            required
            className="p-3 border border-blue-500 rounded-md text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md text-lg font-semibold disabled:opacity-50 transition"
          >
            {editingId ? 'Update Product' : 'Create Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  price: 0,
                  image: '',
                  description: '',
                  inventory: 0,
                });
              }}
              className="flex-grow bg-white-500 hover:bg-white-600 text-blue-700 py-3 rounded-md text-lg font-semibold transition border border-blue-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center py-8 text-blue-800">No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-blue-500 rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer bg-white-100"
            >
              <img
                src={product.image || ''}
                alt={product.name}
                className="max-w-full max-h-40 object-contain mb-5 rounded-md border border-blue-300"
              />
              <div className="text-center mb-4">
                <h2 className="text-h3 font-semibold text-blue-600">{product.name}</h2>
                <p className="text-blue-700 font-bold mt-1">${product.price.toFixed(2)}</p>
                <p className="mt-1 text-blue-800 font-medium">Inventory: {product.inventory}</p>
                <p className="mt-3 text-blue-700">{product.description}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-5 py-2 bg-blue-300 hover:bg-blue-400 rounded-md text-blue-700 font-semibold transition"
                  aria-label={`Edit ${product.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 rounded-md text-white font-semibold transition"
                  aria-label={`Delete ${product.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-6 mt-10 mb-6 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-6 py-3 bg-white-500 border border-blue-500 rounded-md hover:bg-white-600 disabled:opacity-50 shadow-md transition"
        >
          Prev
        </button>
        <span className="text-blue-700 font-semibold select-none">
          {page} / {totalPage}
        </span>
        <button
          disabled={page === totalPage}
          onClick={() => setPage(page + 1)}
          className="px-6 py-3 bg-white-500 border border-blue-500 rounded-md hover:bg-white-600 disabled:opacity-50 shadow-md transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
