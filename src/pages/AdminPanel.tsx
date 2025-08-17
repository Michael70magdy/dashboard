import React, { useState } from 'react';
import { Shield, Plus, Minus, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { teams, addGradeEntry } = useData();
  const navigate = useNavigate();
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [points, setPoints] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !points || !comment.trim()) return;

    setIsSubmitting(true);
    
    try {
      addGradeEntry(selectedTeam, parseInt(points), comment.trim(), user.username);
      
      // Reset form
      setSelectedTeam('');
      setPoints('');
      setComment('');
      
      // Show success (you could add a toast notification here)
      alert('Grade added successfully!');
    } catch (error) {
      alert('Error adding grade. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">Manage team grades and add comments</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Grade Entry</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} (Current: {team.totalPoints} points)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points to Add/Remove
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter points (negative to remove)"
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setPoints(prev => prev ? (parseInt(prev) + 1).toString() : '1')}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPoints(prev => prev ? (parseInt(prev) - 1).toString() : '-1')}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Use positive numbers to add points, negative numbers to remove points
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment / Reason
              </label>
              <div className="relative">
                <MessageSquare className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Explain why points are being added or removed..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedTeam || !points || !comment.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding Grade...' : 'Add Grade Entry'}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-blue-700">
              <p className="font-medium">Add Points Examples:</p>
              <p>• +10 for excellent performance</p>
              <p>• +5 for good teamwork</p>
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Remove Points Examples:</p>
              <p>• -5 for minor rule violation</p>
              <p>• -10 for unsportsmanlike conduct</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;