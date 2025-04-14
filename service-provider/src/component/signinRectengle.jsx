import React from 'react';
import { Link } from 'react-router-dom';  // Make sure to import Link
import './component.css';

const SignInRectengle = () => {
  return (
    <div className="signinrectangle23">
      <h4>Welcome back!</h4>
      <h3>To keep connected with us, please login with your personal information</h3>

      <Link to="/login">  {/* Ensure this links to the correct route */}
        <button className="btn-signin4">Signin</button>
      </Link>
    </div>
  );
};

export default SignInRectengle;
