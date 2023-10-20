const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', __dirname + '/views'); // Specify the directory for your views

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your CSS, images, etc.)
app.use(express.static('public'));

// Serve the main index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Define a route that renders the admin page
app.get('/admin', (req, res) => {
    res.render('admin');
});

// Define a route for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Replace this with your authentication logic
    if (username === 'Estefanus' && password === 'Mikalonte') {
        res.redirect('/admin');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
