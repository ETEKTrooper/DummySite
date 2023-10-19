const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('userdb.sqlite');

// Create a table for users (if it doesn't exist)
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'your-secret-key', // Change this to a secure, random string
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());

// Serve static files (your HTML, CSS, images, etc.)
app.use(express.static('public'));

// Passport Local Strategy for user login
passport.use(new LocalStrategy(
    function (username, password, done) {
        // Replace with a database query to check if the user exists and validate the password
        db.get("SELECT * FROM users WHERE username = ?", [username], function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            // Replace 'user.password' with the hashed and salted password
            if (user.password !== password) return done(null, false);
            return done(null, user);
        });
    }
));

// Serialize and deserialize user for session management
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.get("SELECT * FROM users WHERE id = ?", [id], function (err, user) {
        done(err, user);
    });
});

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin.html',
    failureRedirect: '/login.html', // Redirect to login page on authentication failure
}));

app.get('/admin.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/admin/admin.html');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Middleware for authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
