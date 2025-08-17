import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import TeamDetail from './pages/TeamDetail';
import LoginModal from './components/LoginModal';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/team/:teamId" element={<TeamDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <LoginModal />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;