import React from "react";
import { Link } from "react-router-dom";
import SignUpRectangle from "../component/signUpRectengle.jsx"
import  SignInForm from "../component/signInForm.jsx"

const Login = () => {
  return (
    <div className="rectangle">
          <SignInForm />
          <SignUpRectangle />
    </div>
  );
};

export default Login;
