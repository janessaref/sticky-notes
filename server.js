/*
1. require express library and fs
2. create PORT 
3. create routes GET notes and *
4. GET API routes: /api/notes -- should read all db.json and show all saved notes using JSON
5. POST /api/notes -- saved on req.body and add to db.json and return response to client
6. DELETE api/notes/:id -- query parameter containing unique id of note to delete 
7. need the notes to rewrite in the db.json
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


//  code below is when users visit another page or click a button
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));

});

// api/notes displays all notes
app.get("/api/notes", function(req, res) {
    res.json(savednotes);
});


app.post("/api/notes", function(req, res) {
    let newNote = req.body;
    savednotes.push(newNote);

    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        console.log(data);
        let parsedData = JSON.parse(data);
        parsedData.push(newNote);
        // console.log(parsedData);

        fs.writeFile("./db/db.json", JSON.stringify(parsedData, null, 1), function(err) {
            if (err) throw err;
            res.status(200).json({ status: "ok", newNote: newNote });
        })
    });

});

app.get("/api/notes/:id", function(req, res) {
    var viewNote = req.params.id;

    console.log(viewNote);

    for (var i = 0; i < viewNote.length; i++) {
        if (viewNote === id[i]) {
            return res.json(viewNote[i]);
        }
    }

    return res.json(false);
});

app.delete("/api/notes/:id", function(req, res) {
    let index = req.params.id;
    // let index = req.body.index;
    // console.log(req.data);

    fs.readFile("./db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        data = JSON.parse(data);
        data.splice(index, 1);
        console.log(data);

        fs.writeFile("./db/db.json", JSON.stringify(data, null, 1), function(err) {
            if (err) throw err;
            res.status(200).json({ status: "ok" });
        })
    });
});

// listener to start the server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});