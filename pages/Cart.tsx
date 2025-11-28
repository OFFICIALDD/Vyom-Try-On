import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';

const Cart: React.FC = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCheckingOut(true);
    setTimeout(() => {
      db.saveOrder({
        id: Date.now().toString(),
        userId: user.id,
        items,
        total,
        status: 'pending',
        date: new Date().toISOString()
      });
      clearCart();
      alert('Order Placed Successfully!');
      navigate('/');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Your Kart is Empty</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-semibold">Start Shopping</button>
      </div>
    );
  }

  if (checkingOut) {
    return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-4"></div>
         <h2 className="text-xl font-semibold">Processing Payment...</h2>
       </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Kart</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {items.map(item => (
          <div key={item.id} className="flex items-center p-4 border-b last:border-0 hover:bg-gray-50">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="ml-4 flex-grow">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.category}</p>
              <p className="text-indigo-600 font-bold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Qty: {item.quantity}</span>
              <button 
                onClick={() => removeFromCart(item.id)} 
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        <div className="bg-gray-50 p-6 flex justify-between items-center">
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-2xl font-bold ml-2">₹{total}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
