const express = require('express');
// Import module for handling the database connection from db\connection.js
const db = require('./db/connection');
// Import all API Routes
const apiRoutes = require('./routes/apiRoutes');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    // Method aka Connection Function to start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });