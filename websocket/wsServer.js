const WebSocket = require('ws');
const {
    registerDevice,
    updateStatus
} = require('../services/deviceService');

let clients = {};

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Novo cliente conectado');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());

                if (data.device) {
                    ws.deviceId = data.device;
                    clients[data.device] = ws;

                    console.log(`Dispositivo registrado: ${data.device}`);
                    await registerDevice(data.device);
                }

                if (data.status && ws.deviceId) {
                    console.log(`Status de ${ws.deviceId}: ${data.status}`);
                    await updateStatus(ws.deviceId, data.status);
                }

            } catch (err) {
                console.log('Mensagem inválida:', message.toString());
            }
        });

        ws.on('close', () => {
            if (ws.deviceId) {
                console.log(`Dispositivo desconectado: ${ws.deviceId}`);
                delete clients[ws.deviceId];
            }
        });
    });

    return { clients };
};