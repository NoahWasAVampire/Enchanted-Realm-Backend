const express = require("express");
const uuid = require('uuid');
const dotenv = require('dotenv');
const session = require('express-session');
const store = session.MemoryStore();
dotenv.config();

// create the server
const app = express();
const router = express.Router();
const database = require('./database.js');

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(router);


// add & configure middleware
app.use(session({
    genid: (request) => {
        console.log('Inside the session middleware')
        console.log(request.sessionID)
        return uuid.v4() // use UUIDs for session IDs
    },
    secret: 'unser wildes passwort',
    cookie: {expires:60*60*1000},
    saveUninitialized: false,
    resave:false,
    rolling:true,
    store:store
}))

// create the homepage route at '/'
app.get('/', async (request, response) => {
    console.log('Inside the homepage callback function')
    console.log(request.sessionID)

    let rows = await database.procedure('get_user',['no senior']);
    console.log(rows);

    response.send(`You hit home page!\n`)
})

let authMiddleware = (req, res, next) => {
    if(req.session.authenticated) {
        next();
    } else {
        return res.status(401).json({msg:"Unauthorized"});
    }
};

app.get('/achievements', authMiddleware, async (req, res) => {
    let result = await database.procedure("get_achievements",[req.session.user.userid])
    console.log(result);
    res.json(result);
})

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(401).json({msg:'Bitte geben sie Nutzernamen und Passwort ein.'});
    }

    if(req.session.authenticated) {
        return res.json(req.session);
    }

    let userData = await database.procedure('get_user', [username]);

    if(userData.length == 0) {
        return res.status(401).json({msg:'Der Benutzer existiert nicht.'});
    }

    if(password != userData[0].password) {
        return res.status(401).json({msg:'Das Passwort ist falsch.'});
    }

    req.session.authenticated = true;
    req.session.user = {userid: userData[0].u_id, username, password};
    res.json(req.session);
    console.log(req.session.user.id);
})

app.post('/deleteUser', async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password) {
        return res.status(401).json({msg:'Bitte geben sie ihren richten Nutzernamen und ihr Passwort ein.'});
    }

    if(req.session.authenticated) {
        return res.json(req.session);
    }
    let userData = await database.procedure('get_user', [username]);

    if(userData.length === 0) {
        return res.status(401).json({msg:'Der Benutzer existiert nicht.'});
    }

    if(password !== userData[0].password) {
        return res.status(401).json({msg:'Das Passwort ist falsch.'});
    }
    await database.procedure('delete_user', [username]);
    res.json(req.session);
})

app.post('/register', async(req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(403).json({msg:'Benutzername / Passwort fehlen'});
    }

    if(username.length < 5 || username.length > 45) {
        return res.status(403).json({msg:'Der Benutzername sollte mindestens 6 Zeichen enthalten.'});
    }

    if(password.length < 5 || password.length > 45) {
        return res.status(403).json({msg:'Das Passwort sollte mindestens 6 Zeichen enthalten.'});
    }

    let userData = await database.procedure('get_user', [username]);

    if(userData.length != 0) {
        return res.status(403).json({msg:'Ein Benutzer mit diesem Namen existiert bereits.'});
    }

    await database.procedure('insert_user', [username, password]);

    res.redirect(307, '/login');
})

app.listen(3000, () => {
    console.log("Server listening on Port 3000");
});

app.get('/highscore', authMiddleware, async (req, res) => {
    let result = await database.procedure('get_highscore', [req.session.user.userid]);
    if(result.length == 0) {
        return res.status(500).json({msg:'Unerwarteter Fehler'});
    }
    result[0].username = req.session.user.username;
    res.json(result[0]);
})

app.get('/logout', async(req,res)=>{
    req.session.authenticated = false;
    req.session.user = {};
    res.json({msg:''});
})

app.post('/gameStatistic', authMiddleware, async(req, res) => {
    if (req.session.authenticated === true){
        req.session.authenticated = true;
        res.json(req.session);
        const {score, defeatedEnemy, distance} = req.body;
        await database.procedure('insert_statistic', [req.session.user.id, score, defeatedEnemy, distance]);
    }
})