// service-provider/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(); // Export the context

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from localStorage on mount
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const speciality = localStorage.getItem("speciality");
    const serviceProviderId = localStorage.getItem("serviceProviderId");

    if (token && role && userId) {
      setUser({ token, role, userId, speciality, serviceProviderId });
    }
  }, []);
// service-provider/src/context/AuthContext.jsx
const login = ({ token, role, userId, speciality, serviceProviderId }) => {
  // Store all user data as a single object
  const userData = {
    token,
    role,
    userId,
    speciality,
    serviceProviderId
  };
  
  // Store user data as single JSON object
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);

  // Update state
  setUser(userData);
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

export default AuthProvider; // Export the provider component