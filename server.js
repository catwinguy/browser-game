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

app.use(express.json());
app.use(express.static("public_html"));
app.use(express.static("js"));
app.use(express.static("json"));
app.use(express.static("js/scenes"));
app.use(express.static("."));


//app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
    response.sendFile(path.join(__dirname, 'index.html'));
})

// imports database environment variables
// const connection = require("../env.json");

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