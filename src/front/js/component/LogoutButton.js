import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ actions }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await actions.logout();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return <button variant="outline-light" 
  className="logoutbutton" 
  onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;