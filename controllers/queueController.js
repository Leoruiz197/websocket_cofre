const queueService = require('../services/queueService');

module.exports.join = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deviceId } = req.body;

        const result = await queueService.joinQueue(userId, deviceId);
        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.rejoin = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deviceId } = req.body;

        const result = await queueService.rejoinQueue(userId, deviceId);
        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.start = async (req, res) => {
    try {
        const { deviceId } = req.body;

        const result = await queueService.startNext(deviceId);

        if (!result) {
            return res.status(404).json({
                message: "Fila vazia"
            });
        }

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.finish = async (req, res) => {
    try {
        const { deviceId } = req.body;

        const result = await queueService.finishTurn(deviceId);

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.leave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deviceId } = req.body;

        const result = await queueService.leaveQueue(userId, deviceId);
        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.get = async (req, res) => {
    const { deviceId } = req.params;
    const queue = await queueService.getQueue(deviceId);
    res.json(queue);
};

module.exports.getMyPosition = async (req, res) => {
    try {
        const userId = req.user.id;
        const { deviceId } = req.params;

        const result = await queueService.getUserPosition(userId, deviceId);

        if (!result) {
            return res.status(404).json({
                error: "Usuário não está na fila"
            });
        }

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};