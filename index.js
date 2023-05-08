const express = require("express");
const uuid = require('uuid');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
dotenv.config();



// create the server
const app = express();
const router = express.Router();
const database = require('./database.js');
const {response, request} = require("express");
const {Database} = require("sqlite3");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
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




//create
app.post('/insert', (request, response) => {
    const { name } = request.body;
    const {password} = request.body;
    const {confirmedPassword} = request.body;
    console.log(name)
    console.log(password);
    console.log(confirmedPassword);
    const db = database.getdatabaseInstance();
    const result = db.insertNewUser(name,password,confirmedPassword)
    result
        .then(data => response.json({data:data}))
        .catch(err => console.log(err))


});
//read
/*
router.get('/check',function (req,res){
    pool.query('Select * FROM user',function (error, result){
        if (error){
            res.send(error)
        }
        else {
            res.send(result)
        }
    })
})*/


app.get('/getAll',(request,response) =>{
    const db = database.getdatabaseInstance()
    const result = db.getAllData();
    result
        .then(data => response.json({data : data}))
        .catch(err => console.log(err));
   /* response.json({
        success: true
    })*/
})

//update


//delete


app.listen(3000, () => {
    console.log("Server listening on Port 3000");
});