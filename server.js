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

app.use(session({
    secret: 'covid coders',
    resave: true,
    saveUninitialized: false,
    cookie: {}
}));

let user;

app.get("/users", function (req, res) {
    pool.query("SELECT * FROM users")
        .then(function (response) {
            res.json({ rows: response.rows });
        }).catch(function (error) {
            console.log(error);
            res.status(500).json({ "error": "Server error. Please try again." }).send();
            return;

        });
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
        }
        else {
            bcrypt.hash(req.body.userPassword, saltRounds)
            .then(function (hashedPassword) {
                pool.query("INSERT INTO users (username, hashed_password) VALUES ($1, $2)",
                  [req.body.username, hashedPassword])
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
        }
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({"error": "Server error. Please try again."}).send();
        return;
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
                      req.session.user = req.body.username;
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

function updateScore(score, level, user) {
    let success = false;
    switch(level) {
        case "level1_fastest_run":
            pool.query(
                "UPDATE users SET level1_fastest_run = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        case "level2_fastest_run":
            pool.query(
                "UPDATE users SET level2_fastest_run = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        case "level3_fastest_run":
            pool.query(
                "UPDATE users SET level3_fastest_run = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        case "level4_fastest_run":
            pool.query(
                "UPDATE users SET level4_fastest_run = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        case "level5_fastest_run":
            pool.query(
                "UPDATE users SET level5_fastest_run = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        case "story_high_score":
            pool.query(
                "UPDATE users SET story_high_score = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        case "infinite_high_score":
            pool.query(
                "UPDATE users SET infinite_high_score = $1 WHERE username = $2",
                [score, user]
            ).then(function(response) {
                success = true;
            }).catch(function (error) {
                console.log(error);
            });
            break;
        default:
            break;
    }
    return success;
}



app.post("/story-highscore", function (req, res) {
    if (!req.body.hasOwnProperty("score") ||
        !req.body.hasOwnProperty("level"))
    {
        res.status(500).json({"error": "Invalid request."}).send();
    }
    else {
        let score = req.body.score;
        let level = req.body.level;
        if (!req.session.hasOwnProperty("user")) {
            req.session.user = "amanda";
        }
        pool.query(
            "SELECT * FROM users WHERE username = $1",
            [req.session.user]
        ).then(function (response) {
            let fastestRun = response.rows[0][level];
            if (score < fastestRun || fastestRun === null) {
                if (updateScore(score, level, req.session.user)) {
                    let scores = response.rows[0];
                    if (scores["level1_fastest_run"] !== null &&
                        scores["level2_fastest_run"] !== null &&
                        scores["level3_fastest_run"] !== null &&
                        scores["level4_fastest_run"] !== null &&
                        scores["level5_fastest_run"] !== null)
                    {
                        let total = scores["level1_fastest_run"] + scores["level2_fastest_run"] + scores["level3_fastest_run"] + scores["level4_fastest_run"] + scores["level5_fastest_run"];
                        if (!updateScore(total, "story_high_score", req.session.user)) {
                            console.log("Could not update high score.")
                        }
                    }
                    else {
                        res.status(200).send();
                        return;
                    }
                }
                else {
                    res.status(500).json({"error": "Server error. Please try again."}).send();
                    return;
                }
            }
            res.status(200).send();
            return;
        }).catch(function (error) {
            console.log(error);
            res.status(500).json({"error": "Server error. Please try again."}).send();
            return;
        });
    }
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
