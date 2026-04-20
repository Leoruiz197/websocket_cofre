require('dotenv').config();
const express = require('express');
const http = require('http');

const connectDB = require('./config/db');
const setupWebSocket = require('./websocket/wsServer');

const commandRoutes = require('./routes/commandRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(express.json());

// Conecta MongoDB
connectDB();

const server = http.createServer(app);

// Inicializa WebSocket
const { clients } = setupWebSocket(server);

// Rotas
app.use('/commands', commandRoutes(clients));
app.use('/devices', deviceRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

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