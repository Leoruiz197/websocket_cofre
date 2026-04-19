const express = require('express');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

let clients = [];

wss.on('connection', (ws) => {
    console.log('ESP32 conectado');
    clients.push(ws);

    ws.on('message', (message) => {
        console.log('Mensagem do ESP32:', message.toString());
    });

    ws.on('close', () => {
        console.log('ESP32 desconectado');
        clients = clients.filter(c => c !== ws);
    });
});

// ===== FUNÇÃO DE ENVIO =====
function sendCommand(action) {
    const message = JSON.stringify({ action });

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    console.log('Enviado:', message);
}

// ===== ENDPOINT HTTP =====
app.post('/led', (req, res) => {
    const { action } = req.body;

    if (!action) {
        return res.status(400).json({ error: 'action é obrigatório' });
    }

    if (action === 'on') {
        sendCommand('LED_ON');
        return res.json({ message: 'LED ligado' });
    }

    if (action === 'off') {
        sendCommand('LED_OFF');
        return res.json({ message: 'LED desligado' });
    }

    return res.status(400).json({ error: 'Ação inválida' });
});

// ===== STATUS (opcional, útil pra debug) =====
app.get('/status', (req, res) => {
    return res.json({
        connected_clients: clients.length
    });
});

// ===== SERVIDOR HTTP =====

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const wss = new WebSocket.Server({ server });