const pg = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { response } = require("express");
const app = express();
const server = http.Server(app);
const io = socketIO(server);

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
              pool.query("INSERT INTO users (username, hashed_password, high_score) VALUES ($1, $2, $3)",
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

server.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});

// Add the WebSocket handlers
// io.on('connection', function(socket) {
// })

// Event Handler
// socket.on('name', function(data) {
//     // data is a parameter containing whatever data was sent
// });

// Below is for testing Connection!
// setInterval(function() {
//     io.sockets.emit('message', 'hi!');
// }, 1000);

var players = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
    socket.on('new player', function() {
        console.log("The socket is: " + socket.id);
        players[socket.id] = {
        x: 300,
        y: 300
    };
});

// Event Handler
socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);