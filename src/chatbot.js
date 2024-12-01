const fs = require('fs');
const path = require('path');

// Define the path to the JSON file
const stateFilePath = path.join(__dirname, './contactStates.json');

// Load states from the JSON file
const loadStates = () => {
    if (fs.existsSync(stateFilePath)) {
        try {
            const data = fs.readFileSync(stateFilePath, 'utf8');
            return data ? JSON.parse(data) : {};
        } catch (err) {
            console.error('Erro ao carregar o estado:', err);
            return {};
        }
    }
    return {};
};

// Save states to the JSON file
const saveStates = (states) => {
    try {
        fs.writeFileSync(stateFilePath, JSON.stringify(states, null, 2));
    } catch (err) {
        console.error('Erro ao salvar o estado:', err);
    }
};

// Clear states in the JSON file
const clearStates = () => {
    try {
        fs.writeFileSync(stateFilePath, JSON.stringify({}, null, 2));
        console.log('Estados limpos com sucesso!');
    } catch (err) {
        console.error('Erro ao limpar os estados:', err);
    }
};

function start() {
    
    console.log('iniciando');
    clearStates(); // Clear states at the start
    const qrcode = require('qrcode');
    const { Client, Buttons, List, MessageMedia, } = require('whatsapp-web.js'); // Mudança Buttons
  
    let contactStates = loadStates(); // Load states from the JSON file
    console.log('iniciando2');

    const client = new Client;
       
    
      
    
    // client initialize does not finish at ready now.
    client.initialize();
        
        client.on('loading_screen', (percent, message) => {
            console.log('LOADING SCREEN', percent, message);
        });
        
        // Pairing code only needs to be requested once
        let pairingCodeRequested = false;
        client.on('qr', async (qr) => {
            // NOTE: This event will not be fired if a session is specified.
            console.log('QR Code recebido, escaneie o código abaixo');
            qrcode.toFile('./src/frontend/meu_qrcode.png', qr, {
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
                }
            });
            /*
            // paiuting code example
            const pairingCodeEnabled = false;
            if (pairingCodeEnabled && !pairingCodeRequested) {
                const pairingCode = await client.requestPairingCode(''); // enter the target phone number
                console.log('Pairing code enabled, code: '+ pairingCode);
                pairingCodeRequested = true;
            }
                */
        });
        
        
        client.on('authenticated', () => {
            console.log('AUTHENTICATED');
        });
        
        client.on('auth_failure', msg => {
            // Fired if session restore was l
            console.error('AUTHENTICATION FAILURE', msg);
        });
        
        client.on('ready', async () => {
            console.log('READY');
            const debugWWebVersion = await client.getWWebVersion();
            console.log(`WWebVersion = ${debugWWebVersion}`);
            
            client.pupPage.on('console', msg => {
                console.log('PAGE LOG:', msg.text());
            });

            client.pupPage.on('crash', function() {
                console.error('Page crashed! Reinitializing client...');
                client.destroy().then(() => client.initialize());
            });
            
        });

        client.on('disconnected', (reason) => {
            console.log('Client was logged out', reason);
            client.initialize(); // Reinitialize the client on disconnect
        });
        client.on('message_create', async (msg) => {
            console.log('Mensagem recebida:', msg.body);
            if (msg.body === 'ping') {
                msg.reply('pong');
            }
        });

        
    

    const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra
    
    client.on('message', async (msg) => {
        
        const contactId = msg.from; // Load states from the JSON file
        if (!contactStates[contactId]) {
            contactStates[contactId] = {
                visibleMenu: false,
                catalogo: true,
                menuDisponivel: false,
                op1: true
            };
        }
       
        

        const state = contactStates[contactId];

        // Verifica se o comando é uma saudação ou o comando de menu
        if (
            msg.body.match(/(menu|Menu|oi|Oi|Olá|olá|ola|Ola|Bom dia|bom dia)/) &&
            msg.from.endsWith('@c.us') && !state.visibleMenu
        ) {
            const chat = await msg.getChat();
            await delay(2000); // Delay de 2 segundos
            await chat.sendStateTyping(); // Simulando digitação
            await delay(1000); // Delay de 1 segundo
            const contact = await msg.getContact(); // Pegando o contato
            const name = contact.pushname; // Pegando o nome do contato
            state.menuDisponivel = true; // Define o menu como disponível
            state.visibleMenu = true;
            await client.sendMessage(
                msg.from,
                `Olá! ${name.split(" ")[0]}, sou o assistente virtual KTM MOTORS. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - catálogo \n2 - contato\n\n3 - sair`
            );
        } else if (state.menuDisponivel) {
            // Se o menu estiver disponível, vamos processar as opções
            const chat = await msg.getChat();
            await delay(2000);
            await chat.sendStateTyping();
            await delay(1000);

            switch (msg.body) {
                case '1':
                     client.sendMessage(msg.from, '*Catalogo:*\n\n A - 2025 KTM 250 SX-F ADAMO EDITION\n\n B - KTM 250 SX-F 2023\n\n C - 2025 KTM 150 SX\n\n para voltar ao menu digite *menu*');
                     client.sendMessage(msg.from, 'Digite a letra correspondente ao modelo que deseja consultar.');
                    state.op1 = false;
                    state.menuDisponivel = false; // Desativa o menu após enviar as opções
                    state.catalogo = false;
                    state.visibleMenu = false;
                    break;

                case '2':
                    client.sendMessage(
                        msg.from,
                        'Você será redirecionado para o setor *comercial* após clicar no link abaixo. Os responsáveis pelo setor, *Alessandra* ou *Kelly*, irão atendê-lo.\n\nLink: https://wa.me/message/WVH42LVUS3E6N1\n\nDigite "menu" para voltar ao menu principal.'
                    );
                    state.op1 = true;
                    state.menuDisponivel = false; 
                    state.catalogo = true;
                    state.visibleMenu = false;
                    break;
                case '3':
                    delete contactStates[contactId]; // Remove the user's information
                    saveStates(contactStates); // Save the updated states to the JSON file
                    state.op1 = true;
                    state.menuDisponivel = false; // Desativa o menu quando o usuário escolhe sair
                    state.visibleMenu = true;
                    state.catalogo = true;
                    client.sendMessage(msg.from, 'Você saiu do menu e suas informações foram removidas.');
                    break;
                default:
                    client.sendMessage(msg.from, 'Opção inválida. Por favor, escolha uma opção válida ou digite "sair" para sair do menu.');
                    break;
            }

        } else if (!state.op1) {
            
            if (msg.body.toLowerCase() == 'a') {
                const media = MessageMedia.fromFilePath('./src/imagens/adamo.png');
                 client.sendMessage(
                    msg.from, media, { caption:
                        '*2025 KTM 250 SX-F ADAMO EDITION*\n\n*DETALHES TÉCNICOS:*\n*Transmissão:* 5 velocidades\n\n*Motor de partida:* Elétrico\n\n*Peso (sem combustível):* 102,5 kg\n\n*Elevação:* 48,5 mm\n\n*Embreagem:* Wet multi-disc DS clutch, Brembo hydraulics\n\n*Capacidade do tanque:* 7,2 L\n\n*Orifício:* 81 mm\nMais sobre ela no nosso site: https://www.ktm.com/pt-br/models/motocross/4-stroke/2025-ktm-250-sx-fadamoedition.html\n\n para voltar ao catalogo digite: *catálogo*'
                });
                state.catalogo = false;
                state.visibleMenu = false;
                //state.menuDisponivel = true;
            }

            if (msg.body.toLowerCase() == 'b') {
                const media = MessageMedia.fromFilePath('./src/imagens/2023.png');
                 client.sendMessage(
                    msg.from, media, { caption:
                        '*KTM 250 SX-F 2023*\n\n*DETALHES TÉCNICOS:*\n*Transmissão:* 5 velocidades\n\n*Motor de partida:* Elétrico\n\n*Peso (sem combustível):* 101kg\n\n*Elevação:* 48,5 mm\n\n*Embreagem:* Wet multi-disc DS clutch, Brembo hydraulics\n\n*Capacidade do tanque:* 7,2 L\n\n*Orifício:* 81 mm\nMais sobre ela no nosso site: https://www.ktm.com/pt-br/models/motocross/4-stroke/ktm-250-sx-f-2023.html\n\n para voltar ao catalogo digite: *catálogo* '
                });
                state.catalogo = false;
                state.visibleMenu = false;
                //state.menuDisponivel = true;
            }

            if (msg.body.toLowerCase() == 'c') {
                const media = MessageMedia.fromFilePath('./src/imagens/sx.png');
                 client.sendMessage(
                    msg.from, media, { caption:
                        '*2025 KTM 150 SX*\n\n*DETALHES TÉCNICOS:*\n*Transmissão:* 5 velocidades\n\n*Motor de partida:* Elétrico\n\n*Peso (sem combustível):* 101kg\n\n*Elevação:* 48,5 mm\n\n*Embreagem:* Wet multi-disc DS clutch, Brembo hydraulics\n\n*Capacidade do tanque:* 7,2 L\n\n*Orifício:* 81 mm\nMais sobre ela no nosso site: https://www.ktm.com/pt-br/models/motocross/4-stroke/ktm-250-sx-f-2023.html\n\n para voltar ao catalogo digite: *catálogo* '
                });
                state.catalogo = false;
                state.visibleMenu = false;
                //state.menuDisponivel = true;
            }
            state.op1 = true;
        } else if (!state.catalogo) {
            if (msg.body.match(/(catalogo|Catalogo|catálogo)/)) {
                client.sendMessage(msg.from, '*Catalogo:*\n\n A - 2025 KTM 250 SX-F ADAMO EDITION\n\n B - KTM 250 SX-F 2023\n\n C - 2025 KTM 150 SX\n\n para voltar ao menu digite *menu*');
                state.catalogo = true;
                state.visibleMenu = false;
                state.op1 = false;
            }
        } else if (!state.menuDisponivel && state.op1 && state.visibleMenu) {
            // Caso o menu não esteja disponível e o usuário tente interagir
            client.sendMessage(msg.from, 'Digite *menu* para poder voltar ao menu .');
            state.visibleMenu = false;
        }

        contactStates[contactId] = state; // Update the state for the contact
        saveStates(contactStates); // Save states to the JSON file
    });
};

module.exports = { start };
