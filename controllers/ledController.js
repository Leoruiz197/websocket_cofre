const { sendCommand } = require('../services/wsService');

module.exports.controlLed = (clients) => (req, res) => {
    const { device, action } = req.body;

    if (!device || !action) {
        return res.status(400).json({ error: 'device e action são obrigatórios' });
    }

    let command;

    if (action === 'on') command = 'LED_ON';
    else if (action === 'off') command = 'LED_OFF';
    else return res.status(400).json({ error: 'Ação inválida' });

    const success = sendCommand(clients, device, command);

    if (!success) {
        return res.status(404).json({ error: 'Dispositivo não conectado' });
    }

    return res.json({ message: `Comando enviado para ${device}` });
};