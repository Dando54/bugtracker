import React, { useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles/login.css";
const Login = ({
  usernameReg,
  setUsernameReg,
  passwordReg,
  setPasswordReg,
  username,
  setUsername,
  password,
  setPassword,
  loginStatus,
  setLoginStatus,
  isLogged,
  setIsLogged,
  login,
  register,
}) => {
  axios.defaults.withCredentials = true;
  const history = useHistory();
  // const login = () => {
  //   axios
  //     .post("http://localhost:3001/login", {
  //       username: username,
  //       password: password,
  //     })
  //     .then((res) => {
  //       if (res.data.message) {
  //         setLoginStatus(res.data.message);
  //       } else {
  //         setLoginStatus(res.data[0].username);
  //         setIsLogged(true);
  //         history.push("/home");
  //       }
  //     });
  // };
  useEffect(() => {
    if (isLogged === true) {
      history.push("/home");
    }
  }, [isLogged, history]);
  // useEffect(() => {
  //   axios.get("http://localhost:3001/login").then((res) => {
  //     if (res.data.loggedIn === true) {
  //       setLoginStatus(res.data.user[0].username);
  //       setIsLogged(true);
  //     }
  //   });
  //   console.log(isLogged);
  // }, [isLogged, setIsLogged, setLoginStatus]);

  return (
    <div className="loginDiv">
      <div className="registration">
        <h1>Register</h1>
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => {
            setUsernameReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPasswordReg(e.target.value);
          }}
        />
        <button onClick={register}>Register</button>
      </div>
      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></input>
        <input
          type="text"
          placeholder="Password..."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            login();
          }}
        >
          Login
        </button>
      </div>
      <div className="loginStatus">
        <h5>{loginStatus}</h5>
      </div>
    </div>
  );
};

export default Login;
