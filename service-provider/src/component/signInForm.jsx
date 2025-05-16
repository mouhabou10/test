import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔁 import navigate
import axios from 'axios';
import './component.css';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/signin', {
        email,
        password,
      });

      console.log('Login success:', response.data);

      // Optionally store token
      localStorage.setItem('token', response.data.data.token);

      // ✅ Redirect to main/dashboard page
      navigate('/prescription'); // Change this to your actual route

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
