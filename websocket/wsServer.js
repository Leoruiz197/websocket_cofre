const WebSocket = require('ws');
const {
    registerDevice,
    updateDeviceState
} = require('../services/deviceService');

let clients = {};

// 🔥 EXPORTA A FUNÇÃO
const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Novo cliente conectado');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message.toString());

                // REGISTRO
                if (data.device) {
                    ws.deviceId = data.device;
                    clients[data.device] = ws;

                    console.log(`Dispositivo registrado: ${data.device}`);
                    await registerDevice(data.device);
                }

                // STATUS
                if (data.type === "status" && data.device && data.state) {
                    console.log(`Estado recebido de ${data.device}:`, data.state);

                    await updateDeviceState(data.device, data.state);
                }

            } catch (err) {
                console.log('Mensagem inválida:', message.toString());
            }
        });

        ws.on('close', async () => {
            if (ws.deviceId) {
                console.log(`Dispositivo desconectado: ${ws.deviceId}`);
                await updateDeviceState(ws.deviceId, "offline");
                delete clients[ws.deviceId];
            }
        });
    });

    return { clients };
};

// 🔥 EXPORTA A FUNÇÃO
module.exports = setupWebSocket;

// 🔥 EXPORTA O OBJETO COMPARTILHADO (ESSENCIAL)
module.exports.clients = clients;