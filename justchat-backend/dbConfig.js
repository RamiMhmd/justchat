// Connection String to Database 

const mysql = require('mysql');  
let conn = mysql.createConnection({  
    host: 'localhost',  
    user : 'root',  
    password : '12345678',   
    database : 'justchat',  
    multipleStatements : true  
});  

module.exports = conn;