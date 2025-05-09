const express = require('express');
// const serverless = require("serverless-http");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Default route to serve index.html
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// signin route
app.get('/signin', (req, res) => {
    if (req.body && req.body.message) {
        console.log('Received message:', req.body.message);
    }
    res.sendFile(path.join(__dirname, 'public/signin.html'));
});

app.post('/signin', (req, res) => {
    var db = require('./db.js');

    // Handle sign-in logic here
    // For example, check credentials and redirect accordingly
    const { email, password } = req.body;

    console.log('Received sign-in request:', email, password);

    var message = db.verifyUser(email, password)
    if (message) {
        res.redirect('/signin', { message: message });
    } else {
        res.redirect('/index');
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// module.exports.handler = serverless(app);