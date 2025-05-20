import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './component.css';
import useAuth from '../hooks/useAuth';

const SignInForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const adminId = import.meta.env.VITE_ADMIN_ID;

    if (email === adminEmail && password === adminPassword) {
      login({ token: 'admin-token', userId: adminId, role: 'admin' });
      return navigate('/account-demande-list');
    }

    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email,
        password,
      });

      const user = res.data.data.user;
      login({ token: res.data.data.token, userId: user._id, role: user.role });
      navigate('/prescription');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
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
