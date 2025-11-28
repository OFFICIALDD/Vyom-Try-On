import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Shirt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:text-indigo-100 transition">
          <Shirt className="h-8 w-8" />
          <span>Vyom Kart</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-indigo-200">Home</Link>
          <Link to="/#men" className="hover:text-indigo-200">Men</Link>
          <Link to="/#women" className="hover:text-indigo-200">Women</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-yellow-300 hover:text-yellow-100 font-semibold">Admin Panel</Link>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative hover:text-indigo-200">
            <ShoppingCart className="h-6 w-6" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="hover:text-red-300" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-200">
              <UserIcon className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
