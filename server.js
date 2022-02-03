const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//GET test route
app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
});

// Method aka Connection Function to start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});