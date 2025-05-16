import React from 'react'
import "./component.css";
import { Link } from "react-router-dom";
const SignUpRectengle  = () => {
  return (
    <div className="signinrectangle">
    <h1>Hello, Friend!</h1>
    <h3>Enter your personal information and join us!</h3>

    <Link to="/service-signup">
      <button className="btn-signup">Signup</button>
    </Link>
  </div>
  )
}
export default SignUpRectengle 