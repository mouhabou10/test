import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './component.css';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const adminId = import.meta.env.VITE_ADMIN_ID;

    // 🔐 Check if it's admin
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('userId', adminId);
      localStorage.setItem('role', 'admin');

      navigate('/account-demande-list'); // admin dashboard
      return;
    }

    // 👥 Else: Try normal user login
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email,
        password,
      });

      const user = response.data.data.user;

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('role', user.role || 'user'); // fallback role

      navigate('/prescription'); // Or dynamic route by role
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="formrectangle">
      <div className="div-but">
        <h2>Login to AlgiCare</h2>
        <div className="social-buttons">
          <button className="btn-sig">G</button>
          <button className="btn-sig">F</button>
          <button className="btn-sig">in</button>
        </div>
        <h8>or use your email for registration</h8>
      </div>
      <input
        type="email"
        placeholder="Email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-login" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default SignInForm;
