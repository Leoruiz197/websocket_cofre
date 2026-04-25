require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');

const connectDB = require('./config/db');
const setupWebSocket = require('./websocket/wsServer');

const commandRoutes = require('./routes/commandRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const queueRoutes = require('./routes/queueRoutes');
const gameRoutes = require('./routes/gameRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const { cleanupWaitingFirst } = require('./services/queueService');
const { cleanupOfflineDevices } = require('./services/deviceService');

const app = express();
app.use(cors());
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
app.use('/queue', queueRoutes);
app.use('/game', gameRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

setInterval(() => {
    console.log("🔁 Verificando fila...");
    cleanupWaitingFirst();
}, Number(process.env.QUEUE_CHECK_INTERVAL) || 30000);

setInterval(() => {
    console.log("📡 Verificando dispositivos...");
    cleanupOfflineDevices();
}, Number(process.env.DEVICE_CHECK_INTERVAL) || 30000);