const { Client } = require('whatsapp-web.js');
const RemoteAuth = require('whatsapp-web.js/src/authStrategies/RemoteAuth');
const RemoteStore = require('./RemoteStore');

// ...existing code...

(async () => {
    const remoteStore = new RemoteStore('your-mongodb-uri', 'your-database-name');
    await remoteStore.connect();

    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: 'my-client-id', // Substitua por um ID único significativo para você
            dataPath: './.wwebjs_auth/', // Opcional: especifique um caminho personalizado para os arquivos de sessão
            store: remoteStore, // Use a instância do RemoteStore
            backupSyncIntervalMs: 60000 // Opcional: especifique o intervalo de sincronização do backup em milissegundos
        })
    });

    // ...existing code...

    client.initialize();

    // ...existing code...
})();
