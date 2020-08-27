const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const session = require("express-session");

const port = 3000;
const hostname = "localhost";

const saltRounds = 10;
const env = require("./env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.json());
app.use(express.static("public_html"));
app.use(express.static("js"));
app.use(express.static("json"));
app.use(express.static("js/scenes"));
app.use(express.static("."));

app.get('/', function (req, res) {
    pool.query("SELECT * FROM users")
        .then(function (result) {
            console.log(result);
            res.json({ "users": result.rows });
            return;
        })
        .catch(function (error) {
            console.log(error);
            return;
        });
    });

app.use(session({
    key: 'avocado',
    secret: 'covid coders',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000
    }
}));

app.use(function(req, res, next) {
    if (!req.session.hasOwnProperty("highscore")){
        req.session.highscore = 0;
    }

    next()
});

app.post("/create-user", function (req, res) {
    if (!req.body.hasOwnProperty("username") ||
        !req.body.hasOwnProperty("userPassword") ||
        !req.body.hasOwnProperty("userConfirmPassword") ||
        req.body.username.length < 1 ||
        req.body.username.length > 20 ||
        req.body.userPassword.length < 8 ||
        req.body.userPassword.length > 36)
    {
        res.status(401).json({"error": "Invalid input. Please try again."}).send();
        return;
    }

    if (req.body.userPassword !== req.body.userConfirmPassword) {
        res.status(401).json({"error": "Passwords do not match. Please try again."}).send();
        return;
    }

    pool.query(
        "SELECT * FROM users WHERE username = $1",
        [req.body.username]
    ).then(function (response) {
        if (response.rowCount !== 0) {
            res.status(401).json({"error": "Username is taken. Please choose another."}).send();
            return;
        }
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({"error": "Server error. Please try again."}).send();
        return;
    });

    bcrypt.hash(req.body.userPassword, saltRounds)
          .then(function (hashedPassword) {
              pool.query("INSERT INTO users (username, hashed_password, high_score) VALUES ($1, $2, $3, $4)",
                [req.body.username, hashedPassword, 0])
                .then(function (response) {
                    res.status(200).send();
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).json({"error": "Server error. Please try again."}).send();
                });
          })
          .catch(function (error) {
              console.log(error);
              res.status(500).json({"error": "Server error. Please try again."}).send();
          });
});

app.post("/auth", function(req, res) {
    if (!req.body.hasOwnProperty("username") ||
        !req.body.hasOwnProperty("userPassword"))
    {
        res.status(401).json({"error": "Invalid input. Please try again."}).send();
        return;
    }
    pool.query(
        "SELECT hashed_password FROM users WHERE username = $1",
        [req.body.username]
    ).then(function (response) {
        if (response.rowCount === 0) {
            res.status(401).json({"error": "Invalid input. Please try again."}).send();
            return;
        }

        let hashedPassword = response.rows[0].hashed_password;

        bcrypt.compare(req.body.userPassword, hashedPassword)
              .then(function (equal) {
                  if (equal) {
                      res.status(200).send();
                  }
                  else {
                      res.status(401).json({"error": "Invalid input. Please try again."}).send();
                      return;
                  }
              })
              .catch(function (error) {
                  console.log(error);
                  res.status(500).json({"error": "Server error. Please try again."}).send();
              })
    })
    .catch(function (error) {
        console.log(error);
        res.status(500).json({"error": "Server error. Please try again."}).send();
    });
});

app.get("/table", function (req, res) {
    console.log("hi");
    pool.query("SELECT * FROM users")
        .then(function (result) {
            console.log(result.rows);
            res.send(result.rows);
        })
        .catch(function (error) {
            console.log(error);
            return;
        });
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
