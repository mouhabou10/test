// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ named import

const useAuth = () => {
  return useContext(AuthContext);
  
};

export default useAuth;
