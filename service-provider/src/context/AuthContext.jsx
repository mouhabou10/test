// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const speciality = localStorage.getItem("speciality");
    const serviceProvider = localStorage.getItem("serviceProvider");

    if (token && role && userId) {
      setUser({ token, role, userId, speciality, serviceProvider });
    }
  }, []);

  const login = ({ token, role, userId, speciality, serviceProvider }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    if (speciality !== null) localStorage.setItem("speciality", speciality);
    if (serviceProvider !== null) localStorage.setItem("serviceProvider", serviceProvider);

    setUser({ token, role, userId, speciality, serviceProvider });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
