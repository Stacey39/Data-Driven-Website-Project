// 引入 node.js 內建模組
const path = require('path');
const fs = require('fs');

// 引入第三方模組
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');

// 連接 mySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'newuser',
    password: 'newuser1234',
    database: 'nodelogin'
});

const app = express();

app.use(session({
    secret: 'asdqwezxc',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

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


// http://localhost:3000/auth
app.post('/auth', function (request, response) {

    let username = request.body.username;
    let password = request.body.password;



    if (username && password) {

        connection.query(
            'SELECT * FROM accounts WHERE username = ? AND password = ?'
            , [username, password], function (error, results, fields) {

                if (error) {
                    throw error;
                }

                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    request.session.email = results[0].email;
                    response.redirect('/home');
                }
                else {
                    response.send('Incorrect username or password');
                }

                response.end();

            });

    }
    else {
        response.send('Please enter username and password');
        response.end();
    }
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

app.listen(3000);