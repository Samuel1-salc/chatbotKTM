const express = require('express');
const path = require('path');
const chatbot = require('./chatbot'); 
const app = express();
const bodyParser = require('body-parser'); // Add body-parser

const port = 3000;

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'frontend')));
// Rota do chatbot
chatbot.start();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'frontend',  'login.html')); // Use sendFile instead of render
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


