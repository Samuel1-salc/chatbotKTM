const express = require('express');
const path = require('path');
const chatbot = require('./chatbot'); 
const app = express();
const port = 3000;



app.use(express.static(path.join(__dirname, 'frontend')));
// Rota do chatbot
chatbot.start();
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'frontend',  'login.html'));
  
});






// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
