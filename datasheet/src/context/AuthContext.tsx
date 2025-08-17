import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'team';
  teamId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  loginType: 'admin' | 'team';
  setLoginType: (type: 'admin' | 'team') => void;
  selectedTeamId: string | null;
  setSelectedTeamId: (teamId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers = [
  { id: '1', username: 'admin', password: 'admin2024', role: 'admin' as const },
  { id: '2', username: 'teamred', password: 'redpass', role: 'team' as const, teamId: 'red' },
  { id: '3', username: 'teamblue', password: 'bluepass', role: 'team' as const, teamId: 'blue' },
  { id: '4', username: 'teamgreen', password: 'greenpass', role: 'team' as const, teamId: 'green' },
  { id: '5', username: 'teamyellow', password: 'yellowpass', role: 'team' as const, teamId: 'yellow' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'team'>('admin');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedTeamId(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      showLoginModal,
      setShowLoginModal,
      loginType,
      setLoginType,
      selectedTeamId,
      setSelectedTeamId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};