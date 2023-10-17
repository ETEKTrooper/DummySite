const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('userdb.sqlite');

// Create a table for users (if it doesn't exist)
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

// Middleware for parsing JSON
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, images, etc.)
app.use(express.static('public'));

// Define routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Replace this with a proper authentication mechanism, e.g., checking the database
    // For demonstration, we're using hardcoded values
    if (username === 'Estefanus' && password === 'Mikalonte') {
        res.status(302).redirect('/admin.html');
    } else {
        // Replace this with your actual error handling logic
        res.status(401).send('Unauthorized');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
