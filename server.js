const express = require('express');
const http = require('http');

const setupWebSocket = require('./websocket/wsServer');
const ledRoutes = require('./routes/ledRoutes');

const app = express();
app.use(express.json());

const server = http.createServer(app);

// Inicializa WebSocket
const { clients } = setupWebSocket(server);

// Injeta clients nas rotas
app.use('/led', ledRoutes(clients));

// Status
app.get('/status', (req, res) => {
    res.json({
        total: Object.keys(clients).length,
        devices: Object.keys(clients)
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});