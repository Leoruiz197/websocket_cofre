const gameService = require('../services/gameService');

// =====================
// FAZER JOGADA
// =====================
module.exports.guess = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deviceId, guess } = req.body;

        const result = await gameService.makeGuess(userId, deviceId, guess);

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// =====================
// ESTADO DO COFRE
// =====================
module.exports.getState = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const result = await gameService.getDeviceState(deviceId);

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// =====================
// RESET (ADMIN)
// =====================
module.exports.reset = async (req, res) => {
    try {
        const { deviceId } = req.body;

        const result = await gameService.resetDevice(deviceId);

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};