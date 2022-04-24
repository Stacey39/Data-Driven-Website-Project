const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : '',
 database : 'nodelogin'
});

// const pool = mysql.createPool({
//     connectionLimit :100,//important
//     host : 'localhost',
//     user :'root',
//     password:'',
//     database:'todolist',
//     debug :false
// });

const app = express();

app.use(session({
 secret: 'secret',
 resave: true,
 saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/ (根目錄)
app.get('/', function(request, response) {
 // Render login template
 response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
// stacey: login <form action='/auth' method='post'> 
app.post('/auth', function(request, response) {
 // Capture the input fields
 // <input name='username'/>
 let username = request.body.username;
 // <input name='password'/>
 let password = request.body.password;
 // Ensure the input fields exists and are not empty
 if (username && password) {
  // Execute SQL query that'll select the account from the database based on the specified username and password
  connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
   // If there is an issue with the query, output the error
   if (error) throw error;
   // If the account exists
   if (results.length > 0) {
    // Authenticate the user
    request.session.loggedin = true;
    request.session.username = username;
    // Redirect to home page
    response.redirect('/home');
   } else {
    response.send('Incorrect Username and/or Password!');
   }   
   response.end();
  });
 } else {
  response.send('Please enter Username and Password!');
  response.end();
 }
});

/**
 * TODO: 
 * 1. add recoverPassword.html (<form action="/changePassword" method="post"> <input name="username">)
 * 2. login.js 路由機制、
 */


app.post('/changePassword', function(request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        updateRow({username, password})
    }
});

function updateRow(data) {
    let updateQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let query = mysql.format(updateQuery,["userInfo","password",data.password,"username",data.username]);
    // query = UPDATE todo SET `password`='Hello' WHERE `username`='shahid'
    pool.query(query,(err,response)=>{
    if(err){
   console.error(err);
   return;
    }
    // rows updated
     console.log(response.affectedRows);
   });
    }

// http://localhost:3000/home
app.get('/home', function(request, response) {
 // If the user is loggedin
 if (request.session.loggedin) {
  // Output username
  response.send('Welcome back, ' + request.session.username + '!');
 } else {
  // Not logged in
  response.send('Please login to view this page!');
 }
 response.end();
});

// http://localhost:3000/recoverPassword
app.get('/recoverPassword', function(req, res) {
    res.sendFile(path.join(__dirname + '/recoverPassword.html'));
});

app.listen(3000);