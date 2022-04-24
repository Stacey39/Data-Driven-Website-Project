const express = require("express");
const app = express();
const mysql = require('mysql');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'databasename'
});


app.get("/",(req,res) => {
    console.log(1)
    pool.getConnection((err,connection) => {
        console.log(2)
        if(err)throw err;
        console.log("Connected as ID: " + connection.threadId);
        connection.query("SELECT * FROM program LIMIT 1",(err,rows)=>{
            connection.release();
            if(err)throw err;
            console.log("The data from user table are:\n",rows);
        });
    });
});

app.listen(3000,()=>{
    console.log("Server is running at port 3000");
});