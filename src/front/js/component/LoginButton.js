import React from 'react';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  return (
    <Link to="/login" className='text-white text-decoration-none'>
      <button className="btn btn-light login-button text-white">Login</button>
    </Link>
  );
};

export default LoginButton;
