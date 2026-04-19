const WebSocket = require('ws');
const {
    registerDevice,
    updateStatus,
    updateDeviceState
} = require('../services/deviceService');

let clients = {};

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());

            // REGISTRO
            if (data.device) {
                ws.deviceId = data.device;
                clients[data.device] = ws;

                await registerDevice(data.device);
            }

            // 🔥 NOVO: STATUS COMPLETO
            if (data.type === "status" && data.device && data.state) {
                console.log(`Estado recebido de ${data.device}:`, data.state);

                await updateDeviceState(data.device, data.state);
            }

        } catch (err) {
            console.log('Mensagem inválida:', message.toString());
        }
    });

    return { clients };
};