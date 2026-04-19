const { updateCommand } = require('./deviceService');

module.exports.sendBatchCommand = async (clients, deviceId, commands) => {
    const client = clients[deviceId];

    if (!client || client.readyState !== 1) {
        return false;
    }

    const message = JSON.stringify({
        type: "batch",
        commands
    });

    client.send(message);

    await updateCommand(deviceId, commands);

    console.log(`Batch enviado para ${deviceId}:`, message);

    return true;
};