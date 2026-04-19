const express = require('express');
const { controlLed } = require('../controllers/ledController');

module.exports = (clients) => {
    const router = express.Router();

    router.post('/', controlLed(clients));

    return router;
};