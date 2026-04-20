# 🔐 Cofre Inteligente com ESP32 + WebSocket

Sistema completo de controle de dispositivos IoT (ESP32) com comunicação em tempo real via WebSocket, backend em Node.js e persistência em MongoDB.

---

## 🚀 Visão Geral

Este projeto implementa um sistema de controle remoto para dispositivos (como cofres inteligentes), permitindo:

- Comunicação em tempo real com ESP32 via WebSocket
- Envio de comandos (batch)
- Recebimento do estado real do dispositivo
- Persistência de dados no MongoDB
- Autenticação de usuários (JWT)
- Controle de acesso às rotas

---

## 🧠 Arquitetura


ESP32 <---> WebSocket Server (Node.js) <---> MongoDB
|
Express API
|
Usuários


---

## 📁 Estrutura do Projeto


backend/
├── config/
│ └── db.js
├── controllers/
│ ├── commandController.js
│ ├── userController.js
│ └── adminController.js
├── middleware/
│ └── authMiddleware.js
├── models/
│ ├── Device.js
│ ├── User.js
│ └── Admin.js
├── routes/
│ ├── commandRoutes.js
│ ├── deviceRoutes.js
│ ├── userRoutes.js
│ └── adminRoutes.js
├── services/
│ ├── deviceService.js
│ ├── wsService.js
│ ├── userService.js
│ └── adminService.js
├── websocket/
│ └── wsServer.js
├── server.js
└── package.json


---

## ⚙️ Tecnologias Utilizadas

- Node.js + Express
- WebSocket (`ws`)
- MongoDB + Mongoose
- JWT (autenticação)
- ESP32 (Arduino)
- ArduinoJson

---

## 🔌 Comunicação com ESP32

### 📤 Envio de comandos

```json
{
  "type": "batch",
  "commands": [
    { "command": "LED", "value": "ON" },
    { "command": "LOCK", "value": "OPEN" }
  ]
}
📥 Resposta do ESP32
{
  "type": "status",
  "device": "cofre1",
  "state": {
    "LED": "ON"
  }
}
🗄️ Persistência

Exemplo no MongoDB:

{
  "deviceId": "cofre1",
  "state": {
    "LED": "ON"
  },
  "lastCommand": [
    { "command": "LED", "value": "ON" }
  ],
  "lastSeen": "2026-04-19T15:12:01.278Z"
}
🔐 Autenticação
Login de usuário
POST /users/login
{
  "email": "usuario@email.com"
}

Resposta:

{
  "token": "JWT_TOKEN",
  "user": { ... }
}
Uso do token
Authorization: Bearer SEU_TOKEN
👨‍💼 Admin
Login
POST /admin/login
🔒 Rotas Protegidas

Exemplo:

POST /commands

Requer:

Authorization: Bearer TOKEN
📡 Endpoints
Dispositivos
GET /devices
Enviar comando
POST /commands
{
  "device": "cofre1",
  "commands": [
    { "command": "LED", "value": "ON" }
  ]
}
Status do servidor
GET /status
⚙️ Configuração
.env
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/db
JWT_SECRET=sua_chave_secreta
▶️ Como rodar
npm install
npm start
🔌 ESP32
Bibliotecas
WiFi.h
WebSocketsClient.h
ArduinoJson
Conexão
webSocket.beginSSL("seu-servidor.onrender.com", 443, "/");
🧪 Testes

Use:

Postman
Insomnia
📌 Funcionalidades
Comunicação WebSocket com ESP32
Envio de comandos em batch
Estado real do dispositivo
Persistência no MongoDB
Login com JWT
Controle de acesso
🚀 Próximos passos
Dashboard em tempo real
Controle por usuário
Detecção de offline
Login com OTP
👨‍💻 Autor

Leonardo

📜 Licença