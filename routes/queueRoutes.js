const express = require('express');
const controller = require('../controllers/queueController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: Gerenciamento da fila de usuários por dispositivo (cofre)
 */

/**
 * @swagger
 * /queue/join:
 *   post:
 *     summary: Entrar na fila
 *     tags: [Queue]
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
 *         description: Usuário entrou na fila
 */
router.post('/join', auth, controller.join);

/**
 * @swagger
 * /queue/rejoin:
 *   post:
 *     summary: Reentrar na fila
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário reentrou na fila
 */
router.post('/rejoin', auth, controller.rejoin);

/**
 * @swagger
 * /queue/leave:
 *   post:
 *     summary: Sair da fila
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário saiu da fila
 */
router.post('/leave', auth, controller.leave);

/**
 * @swagger
 * /queue/position/{deviceId}:
 *   get:
 *     summary: Obter posição do usuário na fila
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         example: cofre1
 *     responses:
 *       200:
 *         description: Posição na fila
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 position:
 *                   type: number
 *                   example: 2
 */
router.get('/position/:deviceId', auth, controller.getMyPosition);

/**
 * @swagger
 * /queue/start:
 *   post:
 *     summary: Iniciar turno (primeiro da fila)
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Turno iniciado
 */
router.post('/start', auth, controller.start);

/**
 * @swagger
 * /queue/finish:
 *   post:
 *     summary: Finalizar turno atual
 *     tags: [Queue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Turno finalizado
 */
router.post('/finish', auth, controller.finish);

/**
 * @swagger
 * /queue/{deviceId}:
 *   get:
 *     summary: Listar fila de um dispositivo
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         example: cofre1
 *     responses:
 *       200:
 *         description: Lista da fila
 */
router.get('/:deviceId', controller.get);

module.exports = router;