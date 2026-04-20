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

ESP32  <--->  WebSocket Server (Node.js)  <---> MongoDB  
                     |  
                 Express API  
                     |  
                  Usuários  

---

## 📁 Estrutura do Projeto

backend/
├── config/
│   └── db.js
├── controllers/
│   ├── commandController.js
│   ├── userController.js
│   └── adminController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Device.js
│   ├── User.js
│   └── Admin.js
├── routes/
│   ├── commandRoutes.js
│   ├── deviceRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── services/
│   ├── deviceService.js
│   ├── wsService.js
│   ├── userService.js
│   └── adminService.js
├── websocket/
│   └── wsServer.js
├── server.js
└── package.json

---

## ⚙️ Tecnologias Utilizadas

- Node.js + Express  
- WebSocket (ws)  
- MongoDB + Mongoose  
- JWT  
- ESP32  
- ArduinoJson  

---

## 🔌 Comunicação

### Envio

{
  "type": "batch",
  "commands": [
    { "command": "LED", "value": "ON" }
  ]
}

### Resposta

{
  "type": "status",
  "device": "cofre1",
  "state": {
    "LED": "ON"
  }
}

---

## 🔐 Autenticação

POST /users/login

{
  "email": "usuario@email.com"
}

---

## ▶️ Como rodar

npm install  
npm start  

---

## 👨‍💻 Autor

Leonardo
