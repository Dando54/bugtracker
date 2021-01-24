import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/App.css";

const App = () => {
  //states pentru memorarea statusurilor aplicatiei
  //nume si parola inregistrare
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  //nume si parola login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // loginStatus - mesajele de eroare in caz de login esuat , in caz de succes va memora usernameul
  const [loginStatus, setLoginStatus] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  //role - admin , mp , tst , vizitator
  const [role, setRole] = useState("vizitator");
  axios.defaults.withCredentials = true;

  const login = () => {
    axios
      .post("http://localhost:3001/login", {
        username: username,
        password: password,
        role: role,
      })
      .then((res) => {
        if (res.data.message) {
          setLoginStatus(res.data.message);
        } else {
          setLoginStatus(res.data[0].username);
          setIsLogged(true);
        }
      });
  };

  const register = () => {
    axios
      .post("http://localhost:3001/register", {
        username: usernameReg,
        password: passwordReg,
      })
      .then((res) => {
        setLoginStatus(res.data);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3001/login").then((res) => {
      if (res.data.loggedIn === true) {
        setLoginStatus(res.data.user[0].username);
        setIsLogged(true);
        setRole(res.data.user[0].role);
      }
    });
  }, [isLogged, setIsLogged, setLoginStatus]);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home">
            <Home
              setLoginStatus={setLoginStatus}
              setIsLogged={setIsLogged}
              isLogged={isLogged}
              role={role}
              setRole={setRole}
              loginStatus={loginStatus}
            />
          </Route>
          <Route exact path="/">
            <Login
              usernameReg={usernameReg}
              setUsernameReg={setUsernameReg}
              passwordReg={passwordReg}
              setPasswordReg={setPasswordReg}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              loginStatus={loginStatus}
              setLoginStatus={setLoginStatus}
              isLogged={isLogged}
              setIsLogged={setIsLogged}
              login={login}
              register={register}
            ></Login>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
