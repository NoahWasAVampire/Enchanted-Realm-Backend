const express = require("express");
const uuid = require('uuid')
const session = require('express-session')

require("./database.js");

// create the server
const app = express();
const router = express.Router();

app.use(router);

// add & configure middleware
app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware')
        console.log(req.sessionID)
        return uuid.v4() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// create the homepage route at '/'
app.get('/', (req, res) => {
    console.log('Inside the homepage callback function')
    console.log(req.sessionID)
    res.send(`You hit home page!\n`)
})

app.listen(3000, () => {
    console.log("Server listening on Port 3000");
});