const express = require('express');
const path = require('path');
const chatbot = require('./chatbot'); 
const app = express();

const primaryPort = process.env.PORT || 3000; // Porta principal
const secondaryPort = 4000; // Porta alternativa

// Use Express built-in middleware  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));
// Rota do chatbot
chatbot.start();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'frontend',  'login.html')); // Use sendFile instead of render
});

// Função para iniciar o servidor
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Porta ${port} já está em uso, tentando porta ${secondaryPort}`);
      if (port === primaryPort) {
        startServer(secondaryPort);
      } else {
        console.error('Ambas as portas estão em uso. Não foi possível iniciar o servidor.');
      }
    } else {
      console.error('Erro ao iniciar o servidor:', err);
    }
  });
};

// Inicia o servidor na porta principal
startServer(primaryPort);