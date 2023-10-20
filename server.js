const express = require('express');
const fs = require('fs'); // Add the 'fs' module to read the secret message HTML file
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/public/admin', (req, res) => {
    // Read the content of the secret message HTML file
    const secretMessageContent = fs.readFileSync(__dirname + '/secret-message.html', 'utf8');
    
    const adminPageContent = `
        <html>
            <head>
                <title>Admin Page</title>
            </head>
            <body>
                <h1>Congratulations!</h1>
                ${secretMessageContent} <!-- Include the secret message here -->
            </body>
        </html>
    `;
    res.send(adminPageContent);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
