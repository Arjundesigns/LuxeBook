
import React from 'react';
import { User, Booking } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (userData: Omit<User, 'recentBookings'>) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addBooking: (booking: Booking) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  React.useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Update user in the mock 'database'
      const users = JSON.parse(localStorage.getItem('users_db') || '[]');
      const index = users.findIndex((u: User) => u.email === user.email);
      
      if (index !== -1) {
          users[index] = user;
      } else {
          users.push(user);
      }
      
      localStorage.setItem('users_db', JSON.stringify(users));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (userData: Omit<User, 'recentBookings'>) => {
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    // Check if exists
    if (users.some((u: User) => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    const newUser: User = { ...userData, recentBookings: [] };
    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? ({ ...prev, ...data }) : null);
  };

  const addBooking = (booking: Booking) => {
    if (!user) return;
    setUser(prev => {
        if (!prev) return null;
        return {
            ...prev,
            recentBookings: [booking, ...(prev.recentBookings || [])]
        };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
