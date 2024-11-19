const express = require('express');
const path = require('path');
//const chatbot = require('./chatbot'); 
const app = express();

const port = 3000;



app.use(express.static(path.join(__dirname, 'frontend')));
// Rota do chatbot
chatbot.start();

app.get('/', (req, res) => {
  res.render(path.join(__dirname,'frontend',  'login'));
  
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


express.Router