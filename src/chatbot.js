// leitor de qr code

function start(mainWindow) {

    console.log('iniciando');

    //const { app } = require('electron');
    const qrcode = require('qrcode');
    const fs = require('fs');
    const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
    const puppeteer = require('puppeteer');
    //const chromeFinder = require('chrome-finder');
    const path = require('node:path')
    //const appPath = app.getAppPath();
    //const qrPath = path.join(appPath, '../', 'qr.png');
    //console.log(qrPath);
   // const chromePath = chromeFinder(); // Encontra o caminho do Chrome ou Chromium no seu sistema
    //console.log('Caminho do aplicativo:', app.getAppPath());


    const client = new Client();
   

    client.on('ready', async () => {
        console.log('WhatsApp Web está pronto!');
        const message = 'Tudo certo! WhatsApp conectado.\nAgora você pode começar a usar o bot!';

    });



    // serviço de leitura do qr code
    client.on('qr', qr => {
        console.log('QR Code recebido, escaneie o código abaixo');
    
        // Gerar e salvar o QR Code como imagem
        qrcode.toFile('./frontend/meu_qrcode.png', qr, {
            width: 300,
            margin: 4,
            color: {
                dark: '#000',
                light: '#fff'
            }
        }, (err) => {
            if (err) {
                console.error('Erro ao gerar o QR Code:', err);
            } else {
                console.log('QR Code salvo como meu_qrcode.png');
                // Aqui você pode adicionar mais lógica se precisar, como retornar o caminho do arquivo
            }
        });
    });


    
    client.on('ready', () => {
        console.log('Tudo certo! WhatsApp conectado.');
        const readyMessage = document.getElementById('whatsapp-connect');
        readyMessage.style.display = 'block';

    });
    // E inicializa tudo 
    client.initialize();

    const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

   

    client.on('message', async msg => {
       // Variável para controlar se o menu está disponível

        if (
            msg.body.match(/(menu|Menu|oi|Oi|Olá|olá|ola|Ola|Bom dia|bom dia)/) &&
            msg.from.endsWith('@c.us')
        ) {
            const chat = await msg.getChat();
            await delay(2000); // delay de 2 segundos
            await chat.sendStateTyping(); // Simulando Digitação
            await delay(1000); // Delay de 1 segundo
            const contact = await msg.getContact(); // Pegando o contato
            const name = contact.pushname; // Pegando o nome do contato
            menuDisponivel = true; // Define o menu como disponível
            await client.sendMessage(
                msg.from,
                `Olá! ${name.split(" ")[0]}, sou o assistente virtual Fama Empreendimentos. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Compras\n2 - Comercial/Aldeia mall\n3 - Financeiro\n4 - RH\n5 - Horário de funcionamento da empresa\n6 - Horário de funcionamento das bicicletas fama\n\n`
            );
            
        } else if (msg.body !== null && msg.from.endsWith('@c.us')) {
            //menuDisponivel = true;
            const chat = await msg.getChat();
            await delay(2000);
            await chat.sendStateTyping();
            await delay(1000);
        }
             // Transforma a mensagem em minúsculo para evitar erros de digitação
             
            if(menuDisponivel == true){
                console.log('Menu Debugg: true');
            }else{
                console.log('Menu Debugg: false');
            }
            // Define o menu como indisponível
            
            // Verifica o valor de menuDisponivel antes de permitir a opção 5
       
                // Desativa o menu após selecionar a opção
                switch (msg.body) {
                    case '1':
                        await client.sendMessage(
                            msg.from,
                            'Você será redirecionado para o setor de *compras* após clicar no link abaixo. O responsável pelo setor, *Alexandre*, irá atendê-lo.\n\nLink do setor Compras:\nhttps://wa.me/message/3YMYLO7P2IZZI1\n\nDigite "menu" para voltar ao menu principal.'
                        );
                        menuDisponivel = false; // Desativa o menu após selecionar a opção
                        break;
    
                    case '2':
                        await client.sendMessage(
                            msg.from,
                            'Você será redirecionado para o setor *comercial* após clicar no link abaixo. Os responsáveis pelo setor, *Alessandra* ou *Kelly*, irão atendê-lo.\n\nLink: https://wa.me/message/WVH42LVUS3E6N1\n\nDigite "menu" para voltar ao menu principal.'
                        );
                        menuDisponivel = false;
                        break;
    
                    case '3':
                        await client.sendMessage(
                            msg.from,
                            'Você será redirecionado para o setor *financeiro* após clicar no link abaixo. A responsável pelo setor, *Tina*, irá atendê-lo.\n\nLink: https://wa.me/message/LZPMECAGSWEME1\n\nDigite "menu" para voltar ao menu principal.'
                        );
                        menuDisponivel = false;
                        break;
    
                    case '4':
                        await client.sendMessage(
                            msg.from,
                            'Você será redirecionado para o setor de *RH* após clicar no link abaixo. A responsável pelo setor, *Simone*, irá atendê-lo.\n\nLink: https://wa.me/message/X2I3KJCENP6EI1\n\nDigite "menu" para voltar ao menu principal.'
                        );
                        menuDisponivel = false;
                        break;
    
                    case '5':
                        await client.sendMessage(
                            msg.from,
                            'Horário de funcionamento da empresa:\n\nSegunda a sexta-feira: 08:00 às 18:00\nSábado: 08:00 às 12:00\n\nDigite "menu" para voltar ao menu principal.'
                        );
                        menuDisponivel = false;
                        break;
    
                    case '6':
                        await client.sendMessage(
                            msg.from,
                            'Horário de funcionamento das bicicletas na graciosa:\n\nApenas aos sábados e domingos\n18:00 às 22:00\n\nDigite "menu" para voltar ao menu principal.'
                        );
                        menuDisponivel = false;
                        break;
                }
            
        

    });
    
    

}
module.exports = { start };
