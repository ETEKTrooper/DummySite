const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const fs = require('fs'); // Include the file system module

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
app.use(express.urlencoded({ extended: true }));

// Serve static files (your HTML, CSS, images, etc.)
app.use(express.static('public'));

// Set up express-session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Set the 'views' directory and EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Received login request with username: ${username} and password: ${password}`);

    // Save the username and password to a file
    const logEntry = `Username: ${username}, Password: ${password}\n`;
    fs.appendFile('loginAttempts.txt', logEntry, (err) => {
        if (err) throw err;
        console.log('Login data saved to file.');
    });

    if (username === 'Estefanus' && password === 'Mikalonte') {
        req.session.isAuthenticated = true; // set session variable
        res.redirect('/admin');
    } else {
        res.status(401).send("Oops! Looks like someone's trying to be sneaky! 😉");
    }
});

// Render the admin page with sensitive data
app.get('/admin', (req, res) => {
    if (!req.session.isAuthenticated) { 
        return res.status(401).send("Oops! Looks like someone's trying to be sneaky! 😉");
    }

    const sensitiveData = {
        codeWord: 'OperationDash',
    };

    res.render('admin', { data: sensitiveData });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
