const express = require('express');
const { controlLed } = require('../controllers/ledController');

module.exports = (clients) => {
    const router = express.Router();

    /**
     * @swagger
     * tags:
     *   name: LED
     *   description: Controle manual do LED/dispositivo
     */

    /**
     * @swagger
     * /led:
     *   post:
     *     summary: Controlar o LED do dispositivo
     *     tags: [LED]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - deviceId
     *               - action
     *             properties:
     *               deviceId:
     *                 type: string
     *                 example: cofre1
     *               action:
     *                 type: string
     *                 enum: [ON, OFF]
     *                 example: ON
     *     responses:
     *       200:
     *         description: Comando enviado com sucesso
     *       400:
     *         description: Dispositivo não conectado ou erro na requisição
     */

    router.post('/', controlLed(clients));

    return router;
};