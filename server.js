const express = require('express');
// Import MySQL2 module
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Method aka Connection Function to start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});