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
    gender: '',
    age: '',
    role: 'client' // Default role
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="rectangle">
      <div className="formrectangle">
        <form onSubmit={handleSubmit} className="login-form" style={{ width: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="div-but">
            <h2>Create Account</h2>
            <div className="social-buttons">
              <button type="button" className="btn-sig">G</button>
              <button type="button" className="btn-sig">F</button>
              <button type="button" className="btn-sig">in</button>
            </div>
            <p className="text-sm text-gray-600">or use your email for registration</p>
          </div>
          {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          
          <input
            type="text"
            placeholder="User ID (NIN)"
            className="input-field"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="input-field"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            className="input-field"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ backgroundColor: 'white' }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Age"
            className="input-field"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="120"
          />
          <button className="btn-login" type="submit">Sign Up</button>
          <p style={{ marginTop: '15px', color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: '#0052E0', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
          </p>
        </form>
      </div>
      
      <div className="signinrectangle23">
        <h4>Welcome Back!</h4>
        <h3>To keep connected with us please login with your personal info</h3>
        <Link to="/login">
          <button className="btn-signin4">Sign In</button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
