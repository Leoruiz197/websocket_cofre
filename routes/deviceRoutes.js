const express = require('express');
const { getAllDevices, getAvailableDevices, getLockedDevices  } = require('../services/deviceService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Gerenciamento de dispositivos (cofres)
 */

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Listar todos os dispositivos
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Lista de dispositivos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   deviceId:
 *                     type: string
 *                     example: cofre1
 *                   state:
 *                     type: string
 *                     example: online
 *                   status:
 *                     type: string
 *                     example: locked
 *                   lastSeen:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-04-22T00:00:00.000Z
 *                   openedBy:
 *                     type: string
 *                     example: 69e4f0c13d68be02463c2559
 *                   openedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-04-22T00:05:00.000Z
 *                   attempts:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                         guess:
 *                           type: string
 *                         otimos:
 *                           type: number
 *                         bons:
 *                           type: number
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       500:
 *         description: Erro ao buscar dispositivos
 */

router.get('/', async (req, res) => {
    try {
        const devices = await getAllDevices();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /devices/locked:
 *   get:
 *     summary: Listar IDs dos dispositivos bloqueados (locked)
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Lista de deviceIds com status locked
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["cofre1", "cofre2"]
 */
router.get('/locked', async (req, res) => {
    try {
        const devices = await getLockedDevices();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /devices/available:
 *   get:
 *     summary: Listar dispositivos disponíveis (online e locked)
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Lista de cofres disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["cofre1", "cofre2"]
 */
router.get('/available', async (req, res) => {
    try {
        const devices = await getAvailableDevices();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;