const express = require('express');
const router = express.Router();
const chatbot = require('./chatbot'); 

// Rota da página de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'frontend',  'login.html'));
});



// Rota da página home (protegida)
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname,'frontend',  'pag.html'));
});

module.exports = router;
