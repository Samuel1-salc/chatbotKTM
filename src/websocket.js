
const WebSocket = require('ws');

let wss;

function setupWebSocketServer() {
    wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.on('message', (message) => {
            console.log('Received:', message);
        });
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

function broadcast(data) {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

module.exports = { setupWebSocketServer, broadcast };