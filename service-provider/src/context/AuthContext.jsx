// service-provider/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (token && storedUser?._id) {
          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          try {
            // Verify token validity
            const response = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/verify`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
              setUser({
                ...storedUser,
                token 
              });
            }
          } catch (err) {
            // Token invalid/expired - clean up
            console.error('Token validation failed:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            window.location.href = '/login';
          }
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;