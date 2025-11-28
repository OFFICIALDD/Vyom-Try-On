import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/dbService';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // Products state
  const [products, setProducts] = useState(db.getProducts());
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Men',
    price: 0,
    stock: 0
  });

  // Orders state
  const orders = db.getOrders();

  if (user?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied</div>;
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category || 'Men',
      price: Number(newProduct.price),
      description: newProduct.description || '',
      image: newProduct.image || 'https://picsum.photos/400/600',
      stock: Number(newProduct.stock)
    };

    db.addProduct(product);
    setProducts(db.getProducts());
    setNewProduct({ category: 'Men', price: 0, stock: 0 }); // Reset
    alert('Product Added');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <button onClick={() => navigate('/')} className="text-indigo-600">Back to Shop</button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Manage Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          View Orders
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input 
                placeholder="Product Name" 
                className="w-full border p-2 rounded" 
                value={newProduct.name || ''} 
                onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                required
              />
              <select 
                className="w-full border p-2 rounded"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option>Men</option>
                <option>Women</option>
                <option>T-shirts</option>
                <option>Jeans</option>
              </select>
              <input 
                type="number" 
                placeholder="Price" 
                className="w-full border p-2 rounded"
                value={newProduct.price || ''}
                onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                required
              />
              <input 
                placeholder="Image URL" 
                className="w-full border p-2 rounded"
                value={newProduct.image || ''}
                onChange={e => setNewProduct({...newProduct, image: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                className="w-full border p-2 rounded"
                value={newProduct.description || ''}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              />
              <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Add Product</button>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
             {products.map(p => (
               <div key={p.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={p.image} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <h4 className="font-bold">{p.name}</h4>
                      <p className="text-sm text-gray-500">₹{p.price} - Stock: {p.stock}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{p.category}</span>
               </div>
             ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t">
                  <td className="p-4 text-sm font-mono">{o.id}</td>
                  <td className="p-4 text-sm">{o.userId}</td>
                  <td className="p-4 font-bold">₹{o.total}</td>
                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase font-bold">{o.status}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(o.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
