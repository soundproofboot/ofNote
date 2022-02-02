// import db, uuid to assign unique ids to incoming notes, fs and path for help with file management
const { notes } = require('./db/db.json');
const { v4: uuidv4 } = require("uuid");
const fs = require('fs');
const path = require('path');

// set up express and assign the port
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// get route for home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// get route for notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// get route for api to pull stored notes form db.json
app.get('/api/notes', (req, res) => {
  res.json(notes);
})

// post route for user to add a new note
app.post('/api/notes', (req, res) => {
  // grab note from body of request
  let note = req.body;
  // assign a random unique id using uuid module
  note.id = uuidv4();
  // add the note object to the array
  notes.push(note);
  // update the json file so the new note is included in it
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify({ notes: notes}, null, 2));
  // respond with the note object that was added
  res.json(note);
})

// delete route to remove a note in storage
app.delete('/api/notes/:id', (req, res) => {
  // grab the id attached to note using the parameters of the request that was sent
  let id = req.params.id
  // grab the individual note the user wants to remove
  let target = notes.filter(note => note.id === id);
  // loop through notes array, when the note with that id is found, splice the array to remove one item at that index
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === id) {
      notes.splice(i, 1);
    }
  }
  // update the db.json file to reflect the modified notes array
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify({ notes: notes}, null, 2));
  // send that removed note object back to user
  res.json(target);
})

// wildcard route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// start the server listening, locally on 3000 or on whatever port used by the environment
app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});