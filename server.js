let { notes } = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const path = require('path');

const express = require("express");
const app = express();


const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
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
  notes.push(note);
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify({ notes: notes}, null, 2));
  res.json(note);
})

app.delete('/api/notes/:id', (req, res) => {
  let id = req.params.id
  let target = notes.filter(note => note.id === id);
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === id) {
      notes.splice(i, 1);
    }
  }
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify({ notes: notes}, null, 2));
  console.log(notes);
  res.json(target);
})
app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});