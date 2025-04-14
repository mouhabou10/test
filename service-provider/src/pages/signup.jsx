import React from "react";
import { Link } from "react-router-dom";
import './pages.css'
import SignInRectengle from "../component/signinRectengle.jsx"
import  SignUpForm from "../component/SignUpForm.jsx"
const Signup = () => {
  return (
    <div className="rectangle1">
    <SignInRectengle/>
    <SignUpForm/>
  </div>
  );
};
export default Signup;