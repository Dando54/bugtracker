import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles/navbar.css";
const Navbar = ({ setIsLogged, setLoginStatus, setRole, username, role }) => {
  const history = useHistory();
  const logout = () => {
    axios.get("http://localhost:3001/logout").then((res) => {
      setLoginStatus(res.data.message);
      setIsLogged(false);
      setRole("vizitator");
      history.push("/");
    });
  };
  return (
    <div className="navbar">
      <h4>username: {username}</h4>
      <button className="logoutBtn" onClick={logout}>
        logout
      </button>
    </div>
  );
};

export default Navbar;
