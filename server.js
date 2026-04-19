const express = require('express');
const WebSocket = require('ws');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===== SERVIDOR HTTP =====
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// ===== WEBSOCKET =====
const wss = new WebSocket.Server({ server });

let clients = {};

wss.on('connection', (ws) => {
    console.log('ESP32 conectado');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            // REGISTRO DO DISPOSITIVO
            if (data.device) {
                ws.deviceId = data.device;
                clients[data.device] = ws;

                console.log(`Dispositivo registrado: ${data.device}`);
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

// ===== FUNÇÃO DE ENVIO =====
function sendCommand(deviceId, action) {
    const client = clients[deviceId];

    if (!client || client.readyState !== WebSocket.OPEN) {
        console.log(`Dispositivo ${deviceId} não conectado`);
        return false;
    }

    const message = JSON.stringify({ action });
    client.send(message);

    console.log(`Enviado para ${deviceId}:`, message);
    return true;
}

// ===== ENDPOINT HTTP =====
app.post('/led', (req, res) => {
    const { device, action } = req.body;

    if (!device || !action) {
        return res.status(400).json({ error: 'device e action são obrigatórios' });
    }

    let command;

    if (action === 'on') command = 'LED_ON';
    else if (action === 'off') command = 'LED_OFF';
    else return res.status(400).json({ error: 'Ação inválida' });

    const success = sendCommand(device, command);

    if (!success) {
        return res.status(404).json({ error: 'Dispositivo não conectado' });
    }

    return res.json({ message: `Comando enviado para ${device}` });
});

app.get('/devices', (req, res) => {
    return res.json({
        devices: Object.keys(clients)
    });
});

// ===== STATUS =====
app.get('/status', (req, res) => {
    return res.json({
        total: Object.keys(clients).length,
        devices: Object.keys(clients)
    });
});