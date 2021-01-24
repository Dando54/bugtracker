import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./styles/mp.css";
const Mp = ({ projects, setProjects, username }) => {
  //states pt modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //states pt modal
  const [showModif, setShowModif] = useState(false);
  const handleCloseModif = () => setShowModif(false);

  const handleShowModif = (e) => {
    const idButon = e.target.id;
    const id = idButon.replace("modifyBtn", "");
    setBtnId(id);
    setShowModif(true);
  };

  //states pt MP
  const [projectName, setProjectName] = useState("");
  const [projectRepo, setProjectRepo] = useState("");
  const [projectTeam, setProjectTeam] = useState("");

  const [updateName, setUpdateName] = useState("");
  const [updateRepo, setUpdateRepo] = useState("");
  const [updateTeam, setUpdateTeam] = useState("");
  // ca sa stiu pe ce buton am apasat , retinand astfel datele ce ii corespund butonului(ex: numele si repo-ul proiectului). Folost in caz ca utilizatorul nu introduce nimic intr-un camp la updatare proiect , ci modifica doar un singur camp.
  const [btnId, setBtnId] = useState("");

  const [mpProjects, setMpProjects] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [availableBugs, setAvailableBugs] = useState([]);
  //bug-ul alocat
  const [myBug, setMyBug] = useState({});
  // daca e alocat sau nu
  const [myBugAlocat, setMyBugAlocat] = useState(false);
  //mesaul de la bug. Nu iti poti aloca mai mult de un bug!
  const [bugMess, setBugMess] = useState("");

  //sa salvez datele scrise in input in states
  const handleProjectName = (e) => {
    setProjectName(e.target.value);
  };
  const handleProjectRepo = (e) => {
    setProjectRepo(e.target.value);
  };
  const handleProjectTeam = (e) => {
    setProjectTeam(e.target.value);
  };

  const handleNameUpdate = (e) => {
    setUpdateName(e.target.value);
  };
  const handleRepoUpdate = (e) => {
    setUpdateRepo(e.target.value);
  };
  const handleTeamUpdate = (e) => {
    setUpdateTeam(e.target.value);
  };

  //sa adaug un proiect in baza de date
  const submitProject = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/newproject", {
        projectName: projectName,
        projectRepo: projectRepo,
        projectTeam: projectTeam,
      })
      .then((res) => {
        axios.get(`http://localhost:3001/alocari/${username}`).then((res) => {
          setMpProjects(res.data);
        });
      });
    // adauga ultimul proiect inregistrat in state-ul de proiecte
    setProjects([
      ...projects,
      {
        Denumire: projectName,
        Repository: projectRepo,
        Echipa: projectTeam,
      },
    ]);
    // aloc noul proiect creat de MP
    axios.post("http://localhost:3001/alocari", {
      username: username,
      project: projectName,
      role: "mp",
    });
    setProjectName("");
    setProjectRepo("");
    setProjectTeam("");
  };

  // pentru a updata proiectul in BD
  const updateProject = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:3001/update`, {
      projectName: updateName,
      projectRepo: updateRepo,
      projectTeam: updateTeam,
      project: mpProjects[btnId].Denumire,
    });
    setUpdateName("");
    setUpdateTeam("");
    setUpdateRepo("");
    window.location.reload();
  };

  //proiectele curente din care utilizatorul cu rol MP face parte
  useEffect(() => {
    axios.get(`http://localhost:3001/alocari/${username}`).then((res) => {
      setMpProjects(res.data);
    });
  }, [username, myBugAlocat]);
  // proiectele disponibile pentru MP
  useEffect(() => {
    if (mpProjects) {
      axios
        .post(`http://localhost:3001/availableprojects`, {
          projects: mpProjects,
        })
        .then((res) => {
          setAvailableProjects(res.data);
        });
    }
  }, [mpProjects]);
  // bugurile disponibile pentru MP
  useEffect(() => {
    axios
      .post(`http://localhost:3001/availablebugs`, {
        projects: mpProjects,
      })
      .then((res) => {
        setAvailableBugs(res.data);
      });
  }, [mpProjects]);

  // am folosit useCallback pentru ca altfel functia ar fii fost randata la infinit => eroare React
  //useCallback salveaza rezultatul functiei in memorie
  const memoizdBugAlocat = useCallback(() => {
    axios.get(`http://localhost:3001/bugalocat/${username}`).then((res) => {
      setMyBug(res.data);
    });
  }, [username]);
  useEffect(() => {
    memoizdBugAlocat();
  }, [memoizdBugAlocat, myBugAlocat]);

  // "join proiect".
  const joinProject = (e) => {
    const idButon = e.target.id;
    const id = idButon.replace("joinBtn", "");
    axios
      .post("http://localhost:3001/alocari", {
        username: username,
        project: availableProjects[id].Denumire,
        role: "mp",
      })
      .then(() => {
        axios.get(`http://localhost:3001/alocari/${username}`).then((res) => {
          setMpProjects(res.data);
        });
      });
  };
  //aloca bug
  const joinBug = (e) => {
    const idButon = e.target.id;
    const id = idButon.replace("joinBug", "");
    axios
      .post("http://localhost:3001/alocaribugs", {
        username: username,
        bug: availableBugs[id].nume,
      })
      .then((res) => {
        setBugMess(res.data);
        if (!myBugAlocat) setMyBugAlocat(true);
      });
  };

  // urmareste schimbarea de status bug
  const handleBugStatus = (e) => {
    const value = e.target.value;

    if (myBug[0]) setMyBugAlocat(true);

    if (value === "rezolvat") {
      axios
        .put("http://localhost:3001/bugs", {
          status: value,
          bug: myBug[0].nume,
          username: username,
        })
        .then((res) => {
          setBugMess(res.data);
          setMyBugAlocat(false);
        });
    }
  };
  // background-ul in functie de statusul bugului
  let background = "";
  return (
    <div className="mpDiv">
      <div className="submitProject">
        <Button variant="primary" onClick={handleShow}>
          Adauga Proiect
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Proiect nou</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="projectForm">
              <label htmlFor="projectname">Denumire:</label>
              <input
                type="text"
                id="projectname"
                name="projectname"
                value={projectName}
                onChange={handleProjectName}
              ></input>
              <label htmlFor="projectrepo">Link Repository:</label>
              <input
                type="text"
                id="projectrepo"
                name="projectrepo"
                value={projectRepo}
                onChange={handleProjectRepo}
              ></input>
              <label htmlFor="projectteam">Echipa:</label>
              <input
                type="text"
                id="projectteam"
                name="projectteam"
                value={projectTeam}
                onChange={handleProjectTeam}
              ></input>
              <input
                type="submit"
                onClick={submitProject}
                value="Submit"
              ></input>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="yourProjects">
        <h2>Proiectele din care faci parte:</h2>
        {mpProjects.map((project, i) => {
          return (
            <div className="individualProject" key={i}>
              <p>Denumire: {project.Denumire}</p>
              <p>Repository: {project.Repository}</p>
              <p>Echipa: {project.Echipa}</p>
              <button onClick={handleShowModif} id={`modifyBtn${i}`}>
                Modifica Proiect
              </button>
              <Modal show={showModif} onHide={handleCloseModif}>
                <Modal.Header closeButton>
                  <Modal.Title>Modifica Proiect:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="projectModify">
                    <label htmlFor="updateName">Denumire:</label>
                    <input
                      type="text"
                      name="updateName"
                      value={updateName}
                      onChange={handleNameUpdate}
                    ></input>
                    <label htmlFor="updateRepo">Repository:</label>
                    <input
                      type="text"
                      name="updateRepo"
                      value={updateRepo}
                      onChange={handleRepoUpdate}
                    ></input>
                    <label htmlFor="updateTeam">Echipa:</label>
                    <input
                      type="text"
                      name="updateTeam"
                      value={updateTeam}
                      onChange={handleTeamUpdate}
                    ></input>
                    <input
                      type="submit"
                      value="Submit"
                      onClick={updateProject}
                    ></input>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModif}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        })}
      </div>
      <div className="mpBugList">
        <h2>Bug-uri din proiectele tale:</h2>
        {availableBugs
          ? availableBugs.map((bug, i) => {
              return (
                <div className="invidualBugDiv" key={i}>
                  <div className="bugBackground">
                    {bug.statusBug === "nerezolvat"
                      ? (background = "#e5707e")
                      : (background = "#c6ebc9")}
                  </div>
                  <div
                    className="individualBug"
                    style={{ backgroundColor: background }}
                  >
                    <p>Nume: {bug.nume}</p>
                    <p>Severitate: {bug.severitate}</p>
                    <p>Prioritate: {bug.prioritate}</p>
                    <p>Descriere: {bug.descriere}</p>
                    <p>Link: {bug.link}</p>
                    <p>Status:{bug.statusBug}</p>
                    {bug.statusBug === "nerezolvat" ? (
                      <button id={`joinBug${i}`} onClick={joinBug}>
                        aloca bug
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <div className="bugMess">{bugMess ? bugMess : null}</div>
      <div className="alocBug">
        <h2>Bug alocat:</h2>
        {myBug[0] ? (
          <div className="alocMyBug">
            <p>Nume:{myBug[0].nume}</p>
            <p>Severitate:{myBug[0].severitate}</p>
            <p>Prioritate:{myBug[0].prioritate}</p>
            <p>Descriere:{myBug[0].descriere}</p>
            <p>Link:{myBug[0].link}</p>
            <select htmlFor="bugalocat" onChange={handleBugStatus}>
              <option value={myBug[0].statusBug}>{myBug[0].statusBug}</option>
              <option value="rezolvat">rezolvat</option>
            </select>
          </div>
        ) : (
          <h4>Nu aveti bug-uri alocate!</h4>
        )}
      </div>
      <div className="allProjects">
        <h2>Proiecte disponibile:</h2>
        {availableProjects ? (
          availableProjects.map((project, i) => {
            return (
              <div className="individualAvailableProject" key={i}>
                <p>Denumire: {project.Denumire}</p>
                <p>Repository: {project.Repository}</p>
                <p>Echipa: {project.Echipa}</p>
                <button id={`joinBtn${i}`} onClick={joinProject}>
                  join proiect
                </button>
              </div>
            );
          })
        ) : (
          <h4>Nu exista proiecte disponibile la momentul actual.</h4>
        )}
      </div>
    </div>
  );
};

export default Mp;
