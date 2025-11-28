import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { useCart } from '../contexts/CartContext';
import { Sparkles, ShoppingBag } from 'lucide-react';

const Home: React.FC = () => {
  const products = db.getProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Experience the Future of Shopping
          </h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Try on clothes virtually with our AI-powered Vyom Try-On technology before you buy.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="relative h-64 overflow-hidden bg-gray-200 group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <span className="text-lg font-bold text-indigo-700">₹{product.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => {
                      addToCart(product);
                      alert('Added to cart!');
                    }}
                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    Add
                  </button>
                  <button 
                    onClick={() => navigate(`/try-on/${product.id}`)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles size={16} />
                    Try-On
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
