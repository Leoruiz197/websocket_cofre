const express = require('express');
const { sendCommands } = require('../controllers/commandController');

module.exports = (clients) => {
    const router = express.Router();

    router.post('/', sendCommands(clients));

    return router;
};