const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
// import statement to allow use of inputCheck() function
const inputCheck = require('../../utils/inputCheck');

// query() Method wrapped in a GET Request attached to an Express.js Route which creates an API Endpoint to get ALL candidates
router.get('/candidates', (req, res) => {
    // < sql variable = JOIN Query; > to get all candidates and their party affiliation
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

// API Endpoint for single candidate with party affiliation
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
      AS party_name 
      FROM candidates 
      LEFT JOIN parties 
      ON candidates.party_id = parties.id 
      WHERE candidates.id = ?`;
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
router.delete('/candidate/:id', (req, res) => {
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
router.post('/candidate', ({ body }, res) => {
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

// Update a candidate's party
router.put('/candidate/:id', (req, res) => {
    // Candidate is allowed to not have party affiliation
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
});

module.exports = router;