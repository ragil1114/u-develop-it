// import MySQL2 module
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '@Rag$-2-Riche$_._14176157!',
      database: 'election'
    },
    // console.log('Connected to the election database.')
);

module.exports = db;