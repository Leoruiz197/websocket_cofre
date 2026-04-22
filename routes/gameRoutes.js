const express = require('express');
const controller = require('../controllers/gameController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Lógica do jogo do cofre
 */

/**
 * @swagger
 * /game/guess:
 *   post:
 *     summary: Enviar tentativa de senha
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - guess
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: cofre1
 *               guess:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Resultado da tentativa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 otimos:
 *                   type: number
 *                   example: 1
 *                 bons:
 *                   type: number
 *                   example: 2
 *                 win:
 *                   type: boolean
 *                   example: false
 *                 attempts:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Erro na tentativa
 */
router.post('/guess', auth, controller.guess);

/**
 * @swagger
 * /game/state/{deviceId}:
 *   get:
 *     summary: Obter estado atual do cofre
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         example: cofre1
 *     responses:
 *       200:
 *         description: Estado do cofre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: locked
 *                 attempts:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: Erro ao buscar estado
 */
router.get('/state/:deviceId', controller.getState);

/**
 * @swagger
 * /game/reset:
 *   post:
 *     summary: Resetar o cofre (gera nova senha)
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: cofre1
 *     responses:
 *       200:
 *         description: Cofre resetado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cofre resetado com nova senha
 *       400:
 *         description: Erro ao resetar
 */
router.post('/reset', auth, controller.reset);

module.exports = router;