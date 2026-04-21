const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome_completo
 *               - email
 *               - telefone
 *               - formacao_academica
 *               - area_interesse
 *             properties:
 *               nome_completo:
 *                 type: string
 *                 example: Leonardo Silva
 *               email:
 *                 type: string
 *                 example: leo@email.com
 *               telefone:
 *                 type: string
 *                 example: 11999999999
 *               formacao_academica:
 *                 type: string
 *                 example: Graduação [completa]
 *               area_interesse:
 *                 type: string
 *                 example: Graduação
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/register', register);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login do usuário por email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: leo@email.com
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/login', login);

module.exports = router;