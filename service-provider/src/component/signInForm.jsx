import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './component.css';
import useAuth from '../hooks/useAuth.js';

const SignInForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const adminId = import.meta.env.VITE_ADMIN_ID;

    try {
      // Admin login check
      if (email === adminEmail && password === adminPassword) {
        login({
          token: 'admin-token',
          userId: adminId,
          role: 'admin',
          speciality: null,
          serviceProvider: null,
        });
        setLoading(false);
        navigate('/account-demande-list');
        return;
      }

      // Backend user login
      const res = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email,
        password,
      });

      const user = res.data.data.user;
      const token = res.data.data.token;

      // Logging in and saving to context
      login({
        token,
        userId: user._id,
        role: user.role,
        speciality: user.speciality || null,
        serviceProvider: user.serviceProvider || null,
      });

      console.log('✅ Login successful, navigating to /prescription');
      setLoading(false);
      navigate('/prescription');
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      setError('Login failed. Please check your credentials.');
      setLoading(false);
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
        <p>or use your email for registration</p>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="btn-login" onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default SignInForm;
