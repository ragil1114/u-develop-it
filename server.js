const express = require('express');
// Import MySQL2 module
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'RawD0gg6157!',
      database: 'election'
    },
    console.log('Connected to the election database.')
);

// The DB object is using the query() Method. This method runs the SQL query and executes the callback with all the resulting rows that match the query. 
// This method is the key component that allows SQL commands to be written in a Node.js app.
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Method aka Connection Function to start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});