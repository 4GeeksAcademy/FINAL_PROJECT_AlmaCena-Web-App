import React from 'react';
import { Link } from "react-router-dom";



const SignUpButton = () => {
  return (
    <Link to="/signup" className='text-white text-decoration-none'>
      <button
      className='signupbutton text-white'>
      Sign Up
    </button></Link>
  );
};

export default SignUpButton;