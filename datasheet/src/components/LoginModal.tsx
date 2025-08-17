import React, { useState } from 'react';
import { X, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginModal: React.FC = () => {
  const {
    showLoginModal,
    setShowLoginModal,
    login,
    loginType,
    selectedTeamId
  } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    
    if (!success) {
      setError('Invalid credentials. Please try again.');
    } else {
      setUsername('');
      setPassword('');
      
      // Navigate to team detail page if it's a team login
      if (loginType === 'team' && selectedTeamId) {
        navigate(`/team/${selectedTeamId}`);
      }
    }
    
    setLoading(false);
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {loginType === 'admin' ? (
              <Shield className="h-5 w-5 text-blue-600" />
            ) : (
              <Users className="h-5 w-5 text-green-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {loginType === 'admin' ? 'Admin Login' : `Team Login`}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loginType === 'team' && selectedTeamId && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Login to view detailed grades for <span className="font-semibold">Team {selectedTeamId.charAt(0).toUpperCase() + selectedTeamId.slice(1)}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder={loginType === 'admin' ? 'admin' : `team${selectedTeamId || 'name'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
          <p className="font-medium mb-1">Demo Credentials:</p>
          {loginType === 'admin' ? (
            <p>Admin: username: <code>admin</code> | password: <code>admin2024</code></p>
          ) : (
            <div>
              <p>Teams: username: <code>team[color]</code> | password: <code>[color]pass</code></p>
              <p>Example: <code>teamred</code> / <code>redpass</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;