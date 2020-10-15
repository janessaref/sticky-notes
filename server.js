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


// sets up the express app telling node we are creating an express server
let app = express();
let PORT = process.env.PORT || 3000;

// sets up express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());