import axios from "axios";
import React, { useState, useEffect } from "react";
import "./styles/admin.css";
const Admin = () => {
  // states pentru cererile Tst + modal Tst
  const [tstRequests, setTstRequests] = useState();
  const [showTst, setShowTst] = useState(false);
  // states pentru cereerile Mp + modal Mp
  const [mpRequests, setMpRequests] = useState();
  const [showMp, setShowMp] = useState(false);

  const [statusTst, setStatusTst] = useState(null); // ca sa updatez pagina fara reload cand status ul se schimba
  const [statusMp, setStatusMp] = useState(null); // ca sa updatez pagina fara reload cand status ul se schimba

  // on-off la Tst Requests
  const showTSTrequests = () => {
    if (!showTst) setShowTst(true);
    else setShowTst(false);
  };

  // requesturile de Tst
  useEffect(() => {
    axios.get("http://localhost:3001/listtst").then((res) => {
      setTstRequests(res.data);
      setStatusTst(null);
    });
  }, [statusTst]);

  // accepta cererea Tst
  const approveTst = (e) => {
    const idButon = e.target.id;
    const id = idButon.replace("btn", "");

    // cand aprob cererea , updatez si rolul userului in DB
    axios.put("http://localhost:3001/updaterole/tst", {
      username: tstRequests[id].username,
      project: tstRequests[id].Denumire,
      role: "tst",
    });
    // ii aloc proiectul pentru care a aplicat si pe care l am aprobat
    axios.post("http://localhost:3001/alocari", {
      username: tstRequests[id].username,
      project: tstRequests[id].Denumire,
      role: "tst",
    });
    setStatusTst(`aprobat${id}`);
  };

  //on-off la MP Requests
  const showMPrequests = () => {
    if (!showMp) setShowMp(true);
    else setShowMp(false);
  };
  // requesturile de Mp
  useEffect(() => {
    axios.get("http://localhost:3001/listmp").then((res) => {
      setMpRequests(res.data);
      setStatusMp(null);
    });
  }, [statusMp]);
  // accepta cererea Mp
  const approveMp = (e) => {
    const idButon = e.target.id;
    const id = idButon.replace("btn", "");
    // cand aprob cererea , updatez si rolul userului in DB
    axios.put("http://localhost:3001/updaterole/mp", {
      username: mpRequests[id].username,
      project: mpRequests[id].Denumire,
      role: "mp",
    });
    // ii aloc proiectul pentru care a aplicat si pe care l am aprobat
    axios.post("http://localhost:3001/alocari", {
      username: mpRequests[id].username,
      project: mpRequests[id].Denumire,
      role: "mp",
    });
    setStatusMp(`aprobat${id}`);
  };

  let backgroundTst = "";
  let backgroundMp = "";
  return (
    <div className="adminPage">
      <h1>Dashboard admin</h1>
      <button onClick={showTSTrequests} className="cerereBtn">
        Cereri TST
      </button>
      <div className="tstRequests">
        {showTst
          ? tstRequests.map((request, i) => {
              return (
                <div className="tstRequestDiv" key={i}>
                  <div className="backgroundColorTst">
                    {request.status === "neaprobat"
                      ? (backgroundTst = "#e5707e")
                      : (backgroundTst = "#c6ebc9")}
                  </div>
                  <div
                    className="tstRequest"
                    style={{ backgroundColor: backgroundTst }}
                  >
                    <p>Username: {request.username}</p>
                    <p>Denumire: {request.Denumire}</p>
                    <p>Status: {request.status}</p>

                    {request.status !== "aprobat" ? (
                      <button
                        className="aprobaTst"
                        id={`btn${i}`}
                        onClick={approveTst}
                      >
                        aproba
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}
      </div>
      <button onClick={showMPrequests} className="cerereBtn">
        Cereri MP
      </button>
      <div className="mpRequests">
        {showMp
          ? mpRequests.map((request, i) => {
              return (
                <div className="mpRequestDiv" key={i}>
                  <div className="backgroundColorMp">
                    {request.status === "neaprobat"
                      ? (backgroundMp = "#e5707e")
                      : (backgroundMp = "#c6ebc9")}
                  </div>
                  <div
                    className="mpRequest"
                    style={{ backgroundColor: backgroundMp }}
                  >
                    <p>Username: {request.username}</p>
                    <p>Denumire: {request.Denumire}</p>
                    <p>Status: {request.status}</p>

                    {request.status !== "aprobat" ? (
                      <button
                        className="aprobaMp"
                        id={`btn${i}`}
                        onClick={approveMp}
                      >
                        aproba
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Admin;
