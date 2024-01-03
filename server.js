const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session'); 

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

app.get('/view-logins', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).send("Error in database operation: " + err.message);
        } else {
            let html = "<h1>Login Records</h1>";
            html += "<table border='1'><tr><th>ID</th><th>Username</th><th>Password</th></tr>";
            rows.forEach(row => {
                html += `<tr><td>${row.id}</td><td>${row.username}</td><td>${row.password}</td></tr>`;
            });
            html += "</table>";
            res.send(html);
        }
    });
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
