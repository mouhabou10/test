import React from 'react'
import "./component.css";
const SignInForm = () => {
  return (
   
    <div className="formrectangle">
            <div className="div-but">
              <h2>Login to AlgiCare</h2>
              <div className="social-buttons">
                <button className="btn-sig">G</button>
                <button className="btn-sig">F</button>
                <button className="btn-sig">in</button>
              </div>
              <h8>or use your email for registraition </h8>
            </div>
            <input type="email" placeholder="Email" className="input-field" />
            <input type="password" placeholder="Password" className="input-field" />
            <button className="btn-login">Login</button>
          </div>
  )
}

export default SignInForm