/*
1. require express library and fs
2. create PORT 
3. create routes GET notes and *
4. GET API routes: /api/notes -- should read all db.json and show all saved notes using json
5. POST /api/notes -- saved on req.body and add to db.json and return response to client
6. DELETE api/notes/:id -- query parameter containing unique id of note to delete 
7. need the notes to rewrite in the db.json and update unique ids
*/

// dependencies
let express = require("express");
let path = require("path");
let fs = require("fs");
let savednotes = require("./db/db.json");

// sets up the express app telling node we are creating an express server
let app = express();
let PORT = process.env.PORT || 8080;

// sets up express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// api/notes displays all notes
app.get("/api/notes", function(req, res) {
    res.json(savednotes);
});

// creates a new note and saves the note
app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    savednotes.push(newNote);

    // adds the unique ID in key value pairs and converts the id to a string
    for (let i = 0; i <= savednotes.length; i++) {
        function adduniqueID(obj, key, id) {
            obj[key] = id.toString();
        };
        savednotes.map(function(note) {
            return adduniqueID(note, "id", i++);
        });
    };

    // allows db.json to be read, parses the data, then pushes the new note created into the parsedData variable
    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        parsedData.push(newNote);

        // stringify parssedData so that the data can be written into db.json and sends a response to the client
        fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 1), function(err) {
            if (err) throw err;
            res.status(200).json({ status: "ok" });
        });
    });
});

// deletes the note containing the unique ID
app.delete("/api/notes/:id", function(req, res) {
    let index = req.params.id;

    // removes the note by the ID 
    for (let j = 0; j < savednotes.length; j++) {
        if (savednotes[j].id === index) {
            savednotes.splice(j.toString(), 1);
        };
    };

    // rewrites the key value pairs of the unique ID for each note
    for (let i = 0; i < savednotes.length; i++) {
        function adduniqueID(obj, key, id) {
            obj[key] = id.toString();
        };
        savednotes.map(function(note) {
            return adduniqueID(note, "id", i++);
        });
    };

    // updates the db.json when the note is deleted 
    fs.writeFile("./db/db.json", JSON.stringify(savednotes, null, 1), function(err) {
        if (err) throw err;
        res.status(200).json({ status: "ok" });
    });
});

//  code below is when users visit another page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// listener to start the server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});