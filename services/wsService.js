module.exports.sendCommand = (clients, deviceId, action) => {
    const client = clients[deviceId];

    if (!client || client.readyState !== 1) {
        return false;
    }

    const message = JSON.stringify({ action });
    client.send(message);

    console.log(`Enviado para ${deviceId}: ${message}`);

    return true;
};