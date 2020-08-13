const pg = require("pg");
const express = require("express");
const app = express();

const port = 3000;
const hostname = "localhost";

app.use(express.json());
app.use(express.static("public_html"));
app.use(express.static("js"));
app.use(express.static("js/scenes"));
app.use(express.static("."));

// imports database environment variables
// const connection = require("../env.json");

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
