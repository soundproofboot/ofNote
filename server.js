const { notes } = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

const express = require("express");
const app = express();

const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
})

app.post('/api/notes', (req, res) => {
  let note = req.body;
  note.id = uuidv4();
  res.json(note);
})

app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});

console.log(notes);