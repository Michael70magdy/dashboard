import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, setShowLoginModal, setLoginType } = useAuth();
  const location = useLocation();

  const handleAdminLogin = () => {
    setLoginType('admin');
    setShowLoginModal(true);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Team Grading System</h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Dashboard
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Admin Panel
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdminLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;