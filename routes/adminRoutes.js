const express = require('express');
const {
    register,
    login
} = require('../controllers/adminController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Rotas administrativas
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Registrar administrador
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Administrador"
 *               email:
 *                 type: string
 *                 example: "admin@email.com"
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Admin criado com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post('/register', register);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login do administrador
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@email.com"
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', login);

module.exports = router;