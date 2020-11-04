const {
    v4: uuidv4
} = require('uuid');
const express = require("express");
const fs = require('fs');
var path = require("path");


var Notes = [];
const app = express();
const PORT = process.env.PORT || 3000;

function getNoteList(req, res) {
    res.status(200);
    res.type("json");
    res.send(Notes);
}

function postNote(req, res) {
    var note = req.body;
    note.id = uuidv4();
    Notes.push(note);
    saveNotes();

    res.status(200);
    res.send("Success");
}

function getNotePage(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
}

function deleteNote(req, res) {
    Notes = Notes.filter((value, index, arr) => {
        return value.id != req.params.id;
    });
    saveNotes();
    res.status(200);
    res.send("Success");
}

function preReadNotes() {
    var stringDB = fs.readFileSync(path.join(__dirname, "db/db.json"));
    if (stringDB != "")
        Notes = JSON.parse(stringDB);
}

function saveNotes() {
    var stringDB = JSON.stringify(Notes);
    fs.writeFile(path.join(__dirname, "db/db.json"), stringDB, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully save notes");
        }
    });
}

function main() {
    preReadNotes();
    console.log("Setting up Webservice");
    app.use(express.static("public"));

    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({
        extended: true
    })); // for parsing application/x-www-form-urlencoded

    app.get("/notes", getNotePage);
    app.get("/api/notes", getNoteList);
    app.delete("/api/notes/:id", deleteNote);
    app.post("/api/notes", postNote);
    app.listen(PORT, () => {
        console.log(`now Running at http://localhost:${PORT}`);
    });
}

main();