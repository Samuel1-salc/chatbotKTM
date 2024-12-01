const express = require('express');
const path = require('path');
const chatbot = require('./chatbot'); 
const app = express();

const primaryPort = process.env.PORT || 3000; // Porta principal


// Use Express built-in middleware  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));
// Rota do chatbot


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'frontend',  'login.html')); // Use sendFile instead of render
});

// Adicione uma nova rota para iniciar o chatbot
app.post('/start-chatbot', (req, res) => {
  chatbot.start();
  res.send('Chatbot iniciado');
});

// Função para iniciar o servidor
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
};

startServer(primaryPort);