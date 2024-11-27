const express = require('express');
const path = require('path');
const chatbot = require('./chatbot'); 
const app = express();

const port = 3000;

// Use Express built-in middleware  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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