const express = require('express');
// import MySQL2 module
const mysql = require('mysql2');
// import statement to allow use of inputCheck() function
const inputCheck = require('./utils/inputCheck');
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

// query() Method wrapped in a GET Request attached to an Express.js Route which creates an API Endpoint to get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
      AS party_name 
      FROM candidates 
      LEFT JOIN parties 
      ON candidates.party_id = parties.id`;
    // The db object is using the query() Method. This method runs the SQL query and executes the callback with all the resulting rows that match the query. 
    // This method is the key component that allows SQL commands to be written in a Node.js app.
    // Get all candidates
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
});

// API Endpoint to get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
        // Statement that ensures there are no affectedeRows as a result of the query.
        // Prevents the deletion of a candidate that doesn't exist.
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'Successfully deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    // inputCheck() Function/Module to verify that user info in the request can create a candidate
    // to use this function, we must import the module at the top of this file
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // db Call w/ Prepared SQL Statement to insert candidate
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    // params Assignement
    const params = [body.first_name, body.last_name, body.industry_connected];
    // db Call logic
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        // Method to send response back to client from server
        res.json({
            message: 'success',
            data: body
        });
    });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Method aka Connection Function to start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});