document.addEventListener('DOMContentLoaded', function () {
    // Seleciona o botão pelo ID
    const chatbotButton = document.getElementById('chatbot-button');
 

    // Função para exibir o QR Code
    function loadQRCode() {
        
        const loader = document.getElementById('loader'); // Container do loader
        const qrImage = document.getElementById('qr-code-image');
        const errorMessage = document.getElementById('error-message');
        // Exibe o loader
        loader.style.display = 'flex';  // Torna o loader visível
        qrImage.style.display = 'none';  // Esconde o QR code antes de tentar carregar
        errorMessage.style.display = 'none'; // Esconde a mensagem de erro

        // Simula o carregamento do QR Code após 3 segundos
        setTimeout(() => {
           
            // Caminho da imagem do QR Code
            const qrImageUrl = "./meu_qrcode.png" + '?t=' + new Date().getTime();  // Adiciona um timestamp à URL
            const img = new Image();
            img.onload = function () {
                // Esconde o loader e exibe o QR code
                loader.style.display = 'none'; // Esconde o loader
                qrImage.src = qrImageUrl; // Atribui o QR Code à imagem
                qrImage.style.display = 'block'; // Exibe o QR code
            };

            img.onerror = function () {
                // Se não conseguir carregar o QR Code, exibe a mensagem de erro
                loader.style.display = 'none'; // Esconde o loader
                errorMessage.style.display = 'block'; // Exibe a mensagem de erro
            };

            img.src = qrImageUrl; // Tenta carregar a imagem
        }, 3000); // Atraso de 3 segundos antes de tentar carregar o QR Code
    }
    
    //loadQRCode(); // Carrega o QR Code

    //Quando o botão for clicado, executa a lógica para carregar o QR Code
    
    chatbotButton.addEventListener('click', function () {
        loadQRCode();
    });

;

    
  
        
    //location.reload(); // Método para recarregar a página
       
    
    
});



