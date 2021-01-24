import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./styles/tester.css";
const Tester = ({ username }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  // seteaza modalul ca vizibil la click si ma folosesc de butonul apast si id-ul acestuia ca sa stiu ce date se leaga de butonul apasat(ex: numele proiectului , ca sa gasesc si id-ul proiectului)
  const handleShow = (e) => {
    const idbtn = e.target.id;
    const id = idbtn.replace("addbug", "");
    setProjectName(tstProjects[id].Denumire);
    setShow(true);
  };

  // states pt Tester
  const [tstProjects, setTstProjects] = useState([]);
  const [availableTstProjects, setAvailableTstProjects] = useState([]);
  const [bugName, setBugName] = useState("");
  const [bugSeverity, setBugSeverity] = useState("Minora");
  const [bugPriority, setBugPriority] = useState("Minora");
  const [bugDesc, setBugDesc] = useState("");
  const [bugLink, setBugLink] = useState("");
  const [projectName, setProjectName] = useState("");

  //pentru a salva datele scrise in inputurile din "Adauga Bug"
  const handleBugName = (e) => {
    setBugName(e.target.value);
  };
  const handleBugSeverity = (e) => {
    setBugSeverity(e.target.value);
  };
  const handleBugPriority = (e) => {
    setBugPriority(e.target.value);
  };
  const handleBugDesc = (e) => {
    setBugDesc(e.target.value);
  };
  const handleBugLink = (e) => {
    setBugLink(e.target.value);
  };

  //request sa trimit bug-ul spre server si sa l adaug in baza de date.
  const handleBugSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/bugs", {
      bugname: bugName,
      bugseverity: bugSeverity,
      bugpriority: bugPriority,
      bugdesc: bugDesc,
      buglink: bugLink,
      project: projectName,
    });
    setBugName("");
    setBugPriority("Minora");
    setBugSeverity("Minora");
    setBugDesc("");
    setBugLink("");
  };

  // request de "alatura-te proiect"
  const joinProjectTst = (e) => {
    const idButon = e.target.id;
    const id = idButon.replace("joinBtn", "");
    axios
      .post("http://localhost:3001/alocari", {
        username: username,
        project: availableTstProjects[id].Denumire,
        role: "tst",
      })
      .then(() => {
        axios.get(`http://localhost:3001/alocari/${username}`).then((res) => {
          setTstProjects(res.data);
        });
      });
  };

  //proiectele curente din care utilizatorul cu rol TST face parte
  useEffect(() => {
    axios.get(`http://localhost:3001/alocari/${username}`).then((res) => {
      setTstProjects(res.data);
    });
  }, [username]);

  // seteaza proiectele disponibile din care nu tst face parte
  useEffect(() => {
    if (tstProjects) {
      axios
        .post(`http://localhost:3001/availableprojects`, {
          projects: tstProjects,
        })
        .then((res) => {
          console.log(res.data);
          setAvailableTstProjects(res.data);
        });
    }
  }, [tstProjects]);

  return (
    <div className="testerDiv">
      <div className="proiecteTst">
        <h1>Proiectele tale:</h1>

        {tstProjects.map((project, i) => {
          return (
            <div className="proiectIndividual" key={i}>
              <p>Denumire:{project.Denumire}</p>
              <p>Repository:{project.Repository}</p>
              <p>Echipa:{project.Echipa}</p>
              <button onClick={handleShow} id={`addbug${i}`}>
                Adauga bug
              </button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Adauga Bug</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="bugsubmit">
                    <label htmlFor="bugname">Denumire bug:</label>
                    <input
                      type="text"
                      name="bugname"
                      onChange={handleBugName}
                      value={bugName}
                    ></input>
                    <label htmlFor="priority">Prioritate:</label>
                    <select
                      name="priority"
                      id="bugpriority"
                      onChange={handleBugPriority}
                      value={bugPriority}
                    >
                      <option value="Minora">Minora</option>
                      <option value="Medie">Medie</option>
                      <option value="Mare">Mare</option>
                      <option value="Imediata">Imediata</option>
                    </select>
                    <label htmlFor="priority">Severitate:</label>
                    <select
                      name="severity"
                      id="bugseverity"
                      onChange={handleBugSeverity}
                      value={bugSeverity}
                    >
                      <option value="Minora">Minora</option>
                      <option value="Medie">Medie</option>
                      <option value="Majora">Majora</option>
                      <option value="Critica">Critica</option>
                    </select>
                    <label htmlFor="bugdesc">Descriere bug:</label>
                    <input
                      type="text"
                      id="bugdesc"
                      name="bugdesc"
                      onChange={handleBugDesc}
                      value={bugDesc}
                    ></input>
                    <label htmlFor="buglink">Link:</label>
                    <input
                      type="text"
                      id="buglink"
                      name="buglink"
                      onChange={handleBugLink}
                      value={bugLink}
                    ></input>
                    <input
                      type="submit"
                      onClick={handleBugSubmit}
                      value="Submit"
                    ></input>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          );
        })}
      </div>
      <div className="proiecteDisponibile">
        <h1>Proiecte disponibile:</h1>
        {availableTstProjects ? (
          availableTstProjects.map((project, i) => {
            return (
              <div className="proiectDisponibil" key={i}>
                <p>Denumire:{project.Denumire}</p>
                <p>Repository:{project.Repository}</p>
                <p>Echipa:{project.Echipa}</p>
                <button id={`joinBtn${i}`} onClick={joinProjectTst}>
                  Alatura-te
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

export default Tester;
