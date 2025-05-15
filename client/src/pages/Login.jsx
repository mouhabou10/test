import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log("Login response:", data); // Debug log
      
      if (response.ok && data.success) {
        // Store the token in localStorage
        localStorage.setItem('token', data.data.token);
        // Store user info if needed
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error or server not responding");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="formrectangle">
        <form className="login-form" onSubmit={handleSubmit} style={{ width: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="div-but">
            <h2>Login to AlgiCare</h2>            <div className="social-buttons">
              <button className="btn-sig" type="button">G</button>
              <button className="btn-sig" type="button">F</button>
              <button className="btn-sig" type="button">in</button>
            </div>
            <p className="text-sm text-gray-600">or use your email for registration</p>
          </div>
          {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-login" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
