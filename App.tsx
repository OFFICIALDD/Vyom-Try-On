import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TryOn from './pages/TryOn';
import AuthPage from './pages/Auth';
import Cart from './pages/Cart';
import Admin from './pages/Admin';

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} Vyom Try-On. All rights reserved.</p>
    </footer>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/try-on/:productId" element={<TryOn />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
