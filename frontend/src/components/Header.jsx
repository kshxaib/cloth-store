import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-display font-bold">
            DIVINE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-gray-600 transition font-medium">
              HOME
            </Link>
            <Link to="/products" className="text-gray-900 hover:text-gray-600 transition font-medium">
              SHOP
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-gray-900 hover:text-gray-600 transition relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </Link>
                
                <Link to="/profile" className="text-gray-900 hover:text-gray-600 transition font-medium">
                  PROFILE
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="text-gray-900 hover:text-gray-600 transition font-bold">
                    ADMIN
                  </Link>
                )}

                <button onClick={handleLogout} className="px-6 py-2 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors">
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-900 hover:text-gray-600 transition font-medium">
                  LOGIN
                </Link>
                <Link to="/register" className="px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
                  REGISTER
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t-2 border-black pt-4">
            <Link to="/" className="block py-2 text-gray-900 hover:text-gray-600 font-medium">
              HOME
            </Link>
            <Link to="/products" className="block py-2 text-gray-900 hover:text-gray-600 font-medium">
              SHOP
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="block py-2 text-gray-900 hover:text-gray-600 font-medium">
                  CART
                </Link>
                <Link to="/profile" className="block py-2 text-gray-900 hover:text-gray-600 font-medium">
                  PROFILE
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block py-2 text-gray-900 font-bold">
                    ADMIN DASHBOARD
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-900 font-medium">
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-900 hover:text-gray-600 font-medium">
                  LOGIN
                </Link>
                <Link to="/register" className="block py-2 text-gray-900 hover:text-gray-600 font-medium">
                  REGISTER
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
