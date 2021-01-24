import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect } from "react";
import "./styles/visitor.css";
const Visitor = ({
  loginStatus,
  role,
  setRole,
  projects,
  defaultSelectedProject,
}) => {
  //states din react-bootstrap pentru modal
  const [showTst, setShowTst] = useState(false);
  const handleCloseTst = () => setShowTst(false);
  const handleShowTst = () => setShowTst(true);

  const [showMp, setShowMp] = useState(false);
  const handleCloseMp = () => setShowMp(false);
  const handleShowMp = () => setShowMp(true);

  const [selectedProject, setSelectedProject] = useState("");
  const becomeTst = () => {
    axios
      .post("http://localhost:3001/requesttst", {
        username: loginStatus,
        selectedProject: selectedProject,
      })
      .then((res) => {
        console.log(res);
      });
    setShowTst(false);
  };

  const becomeMP = () => {
    axios.post("http://localhost:3001/requestmp", {
      username: loginStatus,
      selectedProject: selectedProject,
    });
    setShowMp(false);
  };

  const getSelectedProject = (e) => {
    setSelectedProject(e.target.value);
  };

  // ca sa mentin rolu tst nou setat si la refres-ul paginii
  useEffect(() => {
    if (loginStatus) {
      axios
        .get(`http://localhost:3001/role/${loginStatus}`) //loginStatus va fi de fapt setat ca si numele userului
        .then((res) => {
          if (res.data[0]) setRole(res.data[0].role);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [setRole, loginStatus]);

  useEffect(() => {
    setSelectedProject(defaultSelectedProject);
  }, [setSelectedProject, defaultSelectedProject]);

  return (
    <div className="visitorDiv">
      <div className="aplicaTST">
        <button className="handleShowTst" onClick={handleShowTst}>
          Devino TST
        </button>
        <Modal show={showTst} onHide={handleCloseTst}>
          <Modal.Header closeButton>
            <Modal.Title>Devino TST</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="devinoTst">Proiecte disponibile: </label>
            <select
              name="projects"
              id="projectsTst"
              onChange={getSelectedProject}
            >
              {projects.map((project, i) => {
                return (
                  <option value={project.Denumire} key={i}>
                    {project.Denumire}
                  </option>
                );
              })}
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTst}>
              Close
            </Button>
            <Button variant="primary" onClick={becomeTst}>
              Aplica
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="aplicaMP">
        <button className="handleShowMp" onClick={handleShowMp}>
          Devino MP
        </button>
        <Modal show={showMp} onHide={handleCloseMp}>
          <Modal.Header closeButton>
            <Modal.Title>Devino MP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="devinoMp">Proiecte disponibile: </label>
            <select
              name="projects"
              id="projectsMp"
              onChange={getSelectedProject}
            >
              {projects.map((project, i) => {
                return (
                  <option value={project.Denumire} key={i}>
                    {project.Denumire}
                  </option>
                );
              })}
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseMp}>
              Close
            </Button>
            <Button variant="primary" onClick={becomeMP}>
              Aplica
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Visitor;
