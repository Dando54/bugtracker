const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    name: "userId",
    secret: "parolamea1337",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
      path: "/",
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "bugtracking",
  multipleStatements: true,
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "INSERT INTO users (username,password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (err) console.log(err);
        res.send("Inregistrat cu succes!");
        res.status(201).end();
      }
    );
  });
});

app.get("/logout", (req, res) => {
  if (req.session.user) {
    res.clearCookie("userId", { path: "/" });
    req.session.destroy();
    res.send({ message: "Delogat cu succes!" });
    res.status(201).end();
  }
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) console.log(err);

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, response) => {
          if (response) {
            req.session.user = result;
            res.send(result);
          } else {
            res.send({ message: "Combinatie username/parola gresita" });
          }
        });
      } else {
        res.send({ message: "Utilizatorul nu exista" });
      }
    }
  );
});

app.post("/newproject", (req, res) => {
  const projectName = req.body.projectName;
  const projectRepo = req.body.projectRepo;
  const projectTeam = req.body.projectTeam;

  const sql =
    "INSERT INTO proiecte (Denumire,Repository,Echipa) VALUES (?,?,?)";
  db.query(sql, [projectName, projectRepo, projectTeam], (err, result) => {
    if (err) console.log(err);
    res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
  });
});

app.get("/projects", (req, res) => {
  const sql = "SELECT * FROM proiecte";
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.delete("/delete/:projectName", (req, res) => {
  const name = req.params.projectName;
  // console.log(req.params);

  const sql = "DELETE FROM proiecte WHERE Denumire = ?";
  db.query(sql, name, (err, result) => {
    if (err) console.log(err);
  });
});

app.put("/update", (req, res) => {
  const projectName = req.body.projectName;
  const projectRepo = req.body.projectRepo;
  const projectTeam = req.body.projectTeam;
  const project = req.body.project;

  const sql =
    "UPDATE proiecte SET Denumire = ? ,Repository = ?  ,Echipa = ? WHERE Denumire = ? ";
  db.query(
    sql,
    [projectName, projectRepo, projectTeam, project],
    (err, result) => {
      if (err) console.log(err);
      res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
    }
  );
});

app.post("/requesttst", (req, res) => {
  const username = req.body.username;
  const selectedProject = req.body.selectedProject;

  console.log(req.body);
  const sql =
    "SELECT u.id , p.idProiect FROM users u , proiecte p WHERE username = ? AND Denumire = ?";
  const sql2 = "INSERT INTO cereritst (idUser,idProiect) VALUES (?,?)";
  db.query(sql, [username, selectedProject], (err, result) => {
    if (err) console.log(err);
    const idUser = result[0].id;
    const idProiect = result[0].idProiect;
    console.log(result);
    db.query(sql2, [idUser, idProiect], (err, result) => {
      if (err) console.log(err);
      res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
    });
  });
});

app.get("/role/:username", (req, res) => {
  const username = req.params.username;
  const sql = "SELECT role FROM users WHERE username = ?";

  db.query(sql, username, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/requestmp", (req, res) => {
  const username = req.body.username;
  const selectedProject = req.body.selectedProject;

  console.log(req.body);
  const sql =
    "SELECT u.id , p.idProiect FROM users u , proiecte p WHERE username = ? AND Denumire = ?";
  const sql2 = "INSERT INTO cererimp (idUser,idProiect) VALUES (?,?)";
  db.query(sql, [username, selectedProject], (err, result) => {
    if (err) console.log(err);
    const idUser = result[0].id;
    const idProiect = result[0].idProiect;
    db.query(sql2, [idUser, idProiect], (err, result) => {
      if (err) console.log(err);
      res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
    });
  });
});

app.get("/listtst", (req, res) => {
  const sql =
    "SELECT u.username , p.Denumire ,c.status from cereritst c JOIN users u ON c.idUser = u.id JOIN proiecte p ON c.idProiect = p.idProiect";
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.put("/updaterole/tst", (req, res) => {
  const username = req.body.username;
  const project = req.body.project;
  const role = req.body.role; //setez tst cand aprob cererea

  const sql = "UPDATE users SET role = ? WHERE username = ?";
  const sql2 =
    "SELECT p.idProiect ,u.id FROM proiecte p,users u WHERE Denumire = ? AND username= ? ";
  const sql3 =
    "UPDATE cereritst SET status = 'aprobat' WHERE idUser = ? AND idProiect = ?";
  db.query(sql, [role, username], (err, result) => {
    if (err) console.log(err);
  });
  db.query(sql2, [project, username], (err, result) => {
    if (err) console.log(err);
    const idProiect = result[0].idProiect;
    const id = result[0].id;
    db.query(sql3, [id, idProiect], (err, result) => {
      if (err) console.log(err);
      res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
    });
  });
});

app.get("/listmp", (req, res) => {
  const sql =
    "SELECT u.username , p.Denumire ,c.status from cererimp c JOIN users u ON c.idUser = u.id JOIN proiecte p ON c.idProiect = p.idProiect";
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.put("/updaterole/mp", (req, res) => {
  const username = req.body.username;
  const project = req.body.project;
  const role = req.body.role; //setez mp cand aprob cererea

  const sql = "UPDATE users SET role = ? WHERE username = ?";
  const sql2 =
    "SELECT p.idProiect ,u.id FROM proiecte p,users u WHERE Denumire = ? AND username= ? ";
  const sql3 =
    "UPDATE cererimp SET status = 'aprobat' WHERE idUser = ? AND idProiect = ?";
  db.query(sql, [role, username], (err, result) => {
    if (err) console.log(err);
  });
  db.query(sql2, [project, username], (err, result) => {
    if (err) console.log(err);
    const idProiect = result[0].idProiect;
    const id = result[0].id;
    db.query(sql3, [id, idProiect], (err, result) => {
      if (err) console.log(err);
      res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
    });
  });
});

app.post("/alocari", (req, res) => {
  const username = req.body.username;
  const project = req.body.project;
  const role = req.body.role;

  const sql =
    "SELECT p.idProiect ,u.id FROM proiecte p,users u WHERE Denumire = ? AND username= ? ";
  const sql2 = "INSERT INTO alocari (idProiect,idUser,role) VALUES (?,?,?)";
  db.query(sql, [project, username], (err, result) => {
    if (err) console.log(err);
    if (result[0]) {
      const idProiect = result[0].idProiect;
      const id = result[0].id;
      db.query(sql2, [idProiect, id, role], (err, result) => {
        if (err) console.log(err);
        console.log(result);
        res.status(201).end(); // altfel request-ul ar fii fost pending si apoi failed
      });
    }
  });
});

app.get("/alocari/:username", (req, res) => {
  const username = req.params.username;
  const sql =
    "SELECT p.Denumire , p.Repository , p.Echipa FROM alocari a JOIN proiecte p ON a.idProiect = p.idProiect JOIN users u ON a.idUser = u.id WHERE username = ?";
  db.query(sql, username, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/bugs", (req, res) => {
  const bugname = req.body.bugname;
  const bugpriority = req.body.bugpriority;
  const bugseverity = req.body.bugseverity;
  const bugdesc = req.body.bugdesc;
  const buglink = req.body.buglink;
  const project = req.body.project;

  const sql = "SELECT idProiect FROM proiecte WHERE Denumire = ?";
  const sql2 =
    "INSERT INTO bugs (nume,severitate,prioritate,descriere,link,idProiect) VALUES (?,?,?,?,?,?)";
  db.query(sql, project, (err, result) => {
    if (err) console.log(err);
    const idProiect = result[0].idProiect;
    db.query(
      sql2,
      [bugname, bugseverity, bugpriority, bugdesc, buglink, idProiect],
      (err, result) => {
        if (err) console.log(err);
        res.status(201).end();
      }
    );
  });
});

app.put("/bugs", (req, res) => {
  const status = req.body.status;
  const nume = req.body.bug;
  const username = req.body.username;
  const sql =
    "SELECT b.idBug,u.id FROM bugs b , users u WHERE b.nume = ? AND u.username = ?";
  const sql2 = "UPDATE bugs SET statusBug = ? WHERE idBug = ?";
  const sql3 = "DELETE FROM alocaribugs WHERE idBug= ?";
  db.query(sql, [nume, username], (err, result) => {
    if (err) console.log(err);

    if (result[0]) {
      const idBug = result[0].idBug;
      const idUser = result[0].id;
      db.query(sql2, [status, idBug], (err, result) => {
        if (err) console.log(err);
        db.query(sql3, [idBug], (err, result) => {
          if (err) console.log(err);
          res.send(
            "Bug-ul a fost setat ca si rezolvat si dealocat de la toti utilizatorii!"
          );
        });
      });
    }
  });
});

app.post("/availablebugs", (req, res) => {
  const projects = [];
  for (let i = 0; i < req.body.projects.length; i++) {
    projects.push(req.body.projects[i].Denumire);
  }
  const sql =
    "SELECT b.nume,b.severitate,b.prioritate,b.descriere,b.link,b.statusBug FROM bugs b JOIN proiecte p ON b.idProiect = p.idProiect WHERE p.Denumire IN (?)";
  db.query(sql, [projects], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/availableprojects", (req, res) => {
  const projects = [];
  for (let i = 0; i < req.body.projects.length; i++) {
    projects.push(req.body.projects[i].Denumire);
  }
  const sql =
    "SELECT Denumire,Repository,Echipa FROM proiecte WHERE Denumire NOT IN (?)";
  db.query(sql, [projects], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/alocaribugs", (req, res) => {
  const username = req.body.username;
  const bug = req.body.bug;
  const sql =
    "SELECT b.idBug,u.id FROM bugs b , users u WHERE b.nume = ? AND u.username = ?";
  const sql2 = "SELECT 1 as exista FROM alocaribugs WHERE idUser = ?";
  const sql3 = "INSERT INTO alocaribugs (idBug,idUser) VALUES (?,?)";
  db.query(sql, [bug, username], (err, result) => {
    if (err) console.log(err);

    const idBug = result[0].idBug;
    const idUser = result[0].id;
    db.query(sql2, idUser, (err, result) => {
      if (err) console.log(err);
      if (typeof result[0] === "undefined") {
        //cand tabela este goala , si facem primul entry in baza de date
        db.query(sql3, [idBug, idUser], (err, result) => {
          if (err) console.log(err);
          res.status(201).end();
        });
      } else {
        const existaBugAlocat = result[0].exista;
        if (existaBugAlocat !== 0) {
          res.send("Nu puteti sa va alocati mai mult de 1 bug odata!");
        } else {
          db.query(sql3, [idBug, idUser], (err, result) => {
            if (err) console.log(err);
            res.status(201).end();
          });
        }
      }
    });
  });
});

app.get("/bugalocat/:username", (req, res) => {
  const username = req.params.username;

  const sql = "SELECT id FROM users WHERE username = ?";
  const sql2 =
    "SELECT b.nume,b.severitate,b.prioritate,b.descriere,b.link,b.statusBug FROM alocaribugs a JOIN bugs b ON a.idBug = b.idBug WHERE a.idUser = ?";

  db.query(sql, username, (err, result) => {
    if (err) console.log(err);
    if (result[0]) {
      const idUser = result[0].id;
      db.query(sql2, idUser, (err, result) => {
        if (err) console.log(err);
        res.send(result);
        res.status(201).end();
      });
    }
  });
});

app.listen(3001, () => {
  console.log("running server");
});
