import React, { useState } from 'react';
import api from '../api/axios'; // Make sure this file exists
import './component.css';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      console.log('Login success:', response.data);
      alert('Logged in successfully');
      // Save token if needed: localStorage.setItem('token', response.data.data.token);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed');
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
      <button className="btn-login" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default SignInForm;
