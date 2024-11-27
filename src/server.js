const express = require('express');
const path = require('path');
const session = require('express-session'); // Add express-session
const bodyParser = require('body-parser'); // Add body-parser
const chatbot = require('./chatbot'); 


const app = express();
const port = 3000;


// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve static files from the 'frontend/private' directory, but only for authenticated users
app.use('/chat', isAuthenticated, express.static(path.join(__dirname, 'frontend', 'private')));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Rota do chatbot
chatbot.start();
   

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html')); // Use sendFile instead of render
});

app.post('/login', (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body
    // Replace with your own authentication logic
    if (username === 'admin' && password === 'password') {
        req.session.user = username;
        res.redirect('/chat');
    } else {
        res.redirect('/');
    }
});

app.get('/chat', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'private', 'pag.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/chat');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});











