const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

// Configure EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', __dirname);

// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static('public'));

// Use express-session for managing user sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory user data (replace with a database in a production environment)
const users = [
    { username: 'Estefanus', password: 'Mikalonte' },
    // Add more user data as needed
];

// Function to check if the user exists
function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Route to render the main index.html page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Authenticate the user
    const user = authenticateUser(username, password);

    if (user) {
        // Store the user's username in the session
        req.session.username = username;
        res.redirect('/admin');
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Route to render the admin.ejs page
app.get('/admin', (req, res) => {
    if (req.session.username) {
        res.render('admin', { username: req.session.username });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
