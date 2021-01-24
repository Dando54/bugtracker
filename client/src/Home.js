import React, { useEffect, useState } from "react";
import axios from "axios";

import Visitor from "./Visitor";
import Navbar from "./Navbar";
import Tester from "./Tester";
import Admin from "./Admin";
import Mp from "./Mp";
const Home = ({ setLoginStatus, setIsLogged, role, setRole, loginStatus }) => {
  //states pentru proiecte
  const [projects, setProjects] = useState([]);
  // pentru pagina de vizitator , cand aplic pentru MP , in cazul in care utilizatorul nu selecteaza alt proiect din lista de proiecte
  const [defaultSelectedProject, setDefaultSelectedProject] = useState("");

  //iau toate proiectele
  useEffect(() => {
    axios.get("http://localhost:3001/projects").then((res) => {
      setProjects(res.data);
      if (res.data[0]) setDefaultSelectedProject(res.data[0].Denumire);
    });
  }, []);

  if (role === "vizitator") {
    return (
      <div>
        <Navbar
          setLoginStatus={setLoginStatus}
          setIsLogged={setIsLogged}
          setRole={setRole}
          username={loginStatus}
        ></Navbar>
        <Visitor
          loginStatus={loginStatus}
          setRole={setRole}
          projects={projects}
          defaultSelectedProject={defaultSelectedProject}
        ></Visitor>
      </div>
    );
  } else if (role === "tst") {
    return (
      <div>
        <Navbar
          setLoginStatus={setLoginStatus}
          setIsLogged={setIsLogged}
          setRole={setRole}
          username={loginStatus}
        ></Navbar>
        <Tester username={loginStatus}></Tester>
      </div>
    );
  } else if (role === "mp") {
    return (
      <div>
        <Navbar
          setLoginStatus={setLoginStatus}
          setIsLogged={setIsLogged}
          setRole={setRole}
          username={loginStatus}
        ></Navbar>
        <Mp
          projects={projects}
          setProjects={setProjects}
          username={loginStatus}
        ></Mp>
      </div>
    );
  } else if (role === "admin") {
    return (
      <div>
        <Navbar
          setLoginStatus={setLoginStatus}
          setIsLogged={setIsLogged}
          setRole={setRole}
          username={loginStatus}
        ></Navbar>
        <Admin></Admin>
      </div>
    );
  }
};

export default Home;
