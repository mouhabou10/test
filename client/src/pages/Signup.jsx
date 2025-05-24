import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'client', // Always client
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      if (name === 'password') {
        setPasswordStrength(checkPasswordStrength(value));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Prepare payload for signup
    const payload = {
      ...formData,
      role: 'client', // Ensure client role
    };
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/dashboard');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error('Signup error:', err);
    }
  };

  // Password strength checker
  function checkPasswordStrength(password) {
    if (!password) return '';
    if (password.length < 6) return 'Weak';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^A-Za-z0-9]/)) return 'Strong';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return 'Medium';
    return 'Weak';
  }

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h2 className="signup-heading">create account</h2>
        <div className="signup-social-row">
          <button className="social-btn" type="button"><i className="fab fa-facebook-f"></i></button>
          <button className="social-btn" type="button"><i className="fab fa-google-plus-g"></i></button>
        </div>
        <p className="signup-desc">or use your email for registration</p>
        {error && <div className="error">{error}</div>}
        <div className="input-icon-group">
          <span className="input-icon"><i className="fas fa-id-card"></i></span>
          <input
            type="text"
            placeholder="national id (nin)"
            className="signup-input"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon"><i className="fas fa-user"></i></span>
          <input
            type="text"
            placeholder="full name"
            className="signup-input"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon"><i className="fas fa-envelope"></i></span>
          <input
            type="email"
            placeholder="email"
            className="signup-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon"><i className="fas fa-lock"></i></span>
          <input
            type="password"
            placeholder="password"
            className="signup-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon"><i className="fas fa-lock"></i></span>
          <input
            type="password"
            placeholder="confirme password"
            className="signup-input"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button className="signup-btn" type="submit" disabled={!termsAccepted || formData.password !== formData.confirmPassword || !formData.password}>
          sign up
        </button>
      </div>
      <div className="signup-right">
        <h2 className="welcome-title">welcome back!</h2>
        <p className="welcome-message">to keep connect with us<br/>please login with your<br/>personal information</p>
        <Link to="/login" className="signin-btn">sign in</Link>
      </div>
    </div>
  );
};

export default Signup;
