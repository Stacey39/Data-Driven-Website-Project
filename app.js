// 引入 node.js 內建模組
const path = require('path');
const fs = require('fs');

// 引入第三方模組
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

// 引入 model
const User = require('./models/user');
// 連接 mySQL
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'newuser',
//     password: 'newuser1234',
//     database: 'nodelogin'
// });
const sequelize = require('./util/database');

const app = express();

app.use(session({
    secret: 'asdqwezxc',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));

// http://localhost:3000/
app.get('/', function (request, response) {

    //Load HTML String from a file
    // let data = fs.readFileSync('./login.html',
    //     { encoding: 'utf8', flag: 'r' });

    //Replace parts of your HTML to display your own data
    // data = data.replace('XCDXCD', 'Ali');
    // response.send(data);

    //Display an HTML file without changing it:
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', (req, res) => {
    let loginUser;
    User.findOne({ username: req.body.email})
        .then((user) => {
            loginUser = user.dataValues;
            console.log('1', loginUser);
            return req.body.password === loginUser.password;
        })
        .then((success) => {
            console.log('2', success);
            if (success) {
                req.session.loggedin = true;
                req.session.email = loginUser.email;
                res.redirect('/home');
            }
            else {
                response.send('Incorrect username or password');
            }
            response.end();
        })
        .catch((err) => {
            console.log(err);
        })
});

// http://localhost:3000/home
app.get('/home', function (request, response) {
    if (request.session.loggedin) {
        //Load HTML String from a file
        let data = fs.readFileSync('./home.html',
            { encoding: 'utf8', flag: 'r' });

        //Replace parts of your HTML to display your own data
        data = data.replace('<!--EMAILADDRESS-->', request.session.email);
        response.send(data);
    }
    else {
        response.send('Please login!');
    }
    response.end();
});


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/register', (req, res) => {
    console.log(req.body);
    User.create(req.body)
        .then((result) => {
            console.log('create: ', res);
            return res.redirect('/');
        })
        .catch((err) => {
            console.log('create use error', err);
        });
});

app.get('/changeInfo', (req, res) => {
    User.findOne({ username: req.session.email })
        .then((user) => {
            req.user = {
                ...user,
            };
            res.sendFile(path.join(__dirname + '/changeinformation.html'));
            response.end();
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post('/changeInfo', (req, res) => {
    User.findOne({ username: req.body.email})
        .then((user) => {
            user = {
                ...user,
                ...req.body
            };
            return user.save();
        })
        .then((success) => {
            console.log('2', success);
            if (success) {
                res.redirect('/home');
            }
            else {
                response.send('Update fail');
            }
            response.end();
        })
        .catch((err) => {
            console.log(err);
        })
});

sequelize
    .sync()
    .then((res) => {
        app.listen(3000)
    })
    .catch((err) => {
        console.log('some error ocurred, ', err);
    })