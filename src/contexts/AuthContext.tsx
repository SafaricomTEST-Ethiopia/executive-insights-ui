import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        // The role should be extracted from the token payload if it exists
        // Assuming the backend puts role in the JWT payload
        // This part needs to be aligned with your actual JWT structure
        // For now, let's assume a simple structure or derive it.
        // The provided backend doesn't seem to put the role in the token.
        // Let's fetch the user profile to get the role.
        // For the PoC, we will decode and get username from 'sub'
        setUserRole(decodedToken.role || 'USER'); // Fallback for PoC
      } catch (error) {
        console.error('Invalid token');
        logout();
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
