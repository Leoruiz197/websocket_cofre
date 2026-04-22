const express = require('express');
const { sendCommands } = require('../controllers/commandController');

module.exports = (clients) => {
    const router = express.Router();

    /**
     * @swagger
     * tags:
     *   name: Commands
     *   description: Envio de comandos para dispositivos (ESP32)
     */

    /**
     * @swagger
     * /commands:
     *   post:
     *     summary: Enviar comandos para um dispositivo
     *     tags: [Commands]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - deviceId
     *               - commands
     *             properties:
     *               deviceId:
     *                 type: string
     *                 example: cofre1
     *               commands:
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - command
     *                     - value
     *                   properties:
     *                     command:
     *                       type: string
     *                       example: LOCK
     *                     value:
     *                       type: string
     *                       example: OPEN
     *     responses:
     *       200:
     *         description: Comando enviado com sucesso
     *       400:
     *         description: Dispositivo não conectado
     */

    router.post('/', sendCommands(clients));

    return router;
};