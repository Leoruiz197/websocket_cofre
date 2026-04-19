const express = require('express');
const { getAllDevices } = require('../services/deviceService');

const router = express.Router();

router.get('/', async (req, res) => {
    const devices = await getAllDevices();
    res.json(devices);
});

module.exports = router;