const { sendBatchCommand } = require('../services/wsService');

module.exports.sendCommands = (clients) => async (req, res) => {
    const { device, commands } = req.body;

    if (!device || !commands || !Array.isArray(commands)) {
        return res.status(400).json({
            error: 'device e commands (array) são obrigatórios'
        });
    }

    const success = await sendBatchCommand(clients, device, commands);

    if (!success) {
        return res.status(404).json({
            error: 'Dispositivo não conectado'
        });
    }

    return res.json({
        message: `Comandos enviados para ${device}`
    });
};