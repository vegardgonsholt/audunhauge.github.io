// @ts-check
const CONNECTSTRING = "postgres://bib:123@localhost/bib";
const PORT = 3000;
const express = require("express");
const pgp = require("pg-promise")();
const db = pgp(CONNECTSTRING);
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Define routes.
app.get("/", function(req, res) {
  res.send({ msg: "Jada - serveren er i live." });
});
app.post("/runsql", function(req, res) {
  let data = req.body;
  runsql(res, data);
});
app.get("/htmlfiler", function(req, res) {
  let path = "public";
  fs.readdir(path, function(err, items) {
    res.send({ items});
  });
});
app.listen(3000, function() {
  console.log(`Serveren min har startet på port ${PORT}
  Du kan koble deg til på http://localhost:${PORT}`);
});
async function runsql(res, obj) {
  let results;
  let sql = obj.sql;
  let data = obj.data;
  await db
    .any(sql, data)
    .then(data => {
      results = data;
    })
    .catch(error => {
      console.log("ERROR:", sql, ":", error.message); // print error;
      results = {};
    });
  res.send({ results });
}