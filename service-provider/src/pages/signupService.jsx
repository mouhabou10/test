import React from "react";
import { Link } from "react-router-dom";
import './pages.css'
import SignInRectengle from "../component/signinRectengle.jsx"
import SignUpFormService from "../component/SignUpFormService.jsx";
const SignupService = () => {
  return (
    <div className="rectangle1">
    <SignInRectengle/>
    <SignUpFormService/>
  </div>
  );
};
export default SignupService;