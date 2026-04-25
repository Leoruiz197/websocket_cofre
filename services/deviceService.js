const Device = require('../models/Device');

// ======================
// GERAR SENHA
// ======================
function generateSecret() {
    const numbers = [];

    while (numbers.length < 4) {
        const n = Math.floor(Math.random() * 10).toString();

        if (!numbers.includes(n)) {
            numbers.push(n);
        }
    }

    return numbers.join('');
}

// ======================
// REGISTRAR DEVICE
// ======================
module.exports.registerDevice = async (deviceId) => {

    let device = await Device.findOne({ deviceId });

    // 🔥 NOVO DEVICE
    if (!device) {
        device = await Device.create({
            deviceId,
            secret: generateSecret(),
            state: "online",
            status: "locked",
            attempts: [],
            lastSeen: new Date()
        });

        console.log(`Novo cofre criado: ${deviceId} | senha: ${device.secret}`);

    } else {
        // 🔄 DEVICE EXISTENTE
        device.lastSeen = new Date();
        device.state = "online";

        if (!device.secret) {
            device.secret = generateSecret();
            device.status = "locked";
            device.attempts = [];
        }

        await device.save();
    }

    return device;
};

// ======================
// ATUALIZAR STATUS DO JOGO
// ======================
module.exports.updateStatus = async (deviceId, status) => {
    return await Device.findOneAndUpdate(
        { deviceId },
        {
            status,
            lastSeen: new Date()
        },
        { new: true }
    );
};

// ======================
// ATUALIZAR ÚLTIMO COMANDO
// ======================
module.exports.updateCommand = async (deviceId, commands) => {
    return await Device.findOneAndUpdate(
        { deviceId },
        {
            lastCommand: commands,
            lastSeen: new Date()
        },
        { new: true }
    );
};

// ======================
// ATUALIZAR ESTADO (ONLINE/OFFLINE)
// ======================
module.exports.updateDeviceState = async (deviceId, state) => {
    return await Device.findOneAndUpdate(
        { deviceId },
        {
            state,
            lastSeen: new Date()
        },
        { new: true }
    );
};

// ======================
// LISTAR DEVICES
// ======================
module.exports.getAllDevices = async () => {
    return await Device.find();
};

module.exports.getLockedDevices = async () => {
    const devices = await Device.find(
        { status: "locked" },
        { deviceId: 1, _id: 0 } // 🔥 só retorna deviceId
    );

    // transforma em array simples
    return devices.map(d => d.deviceId);
};

module.exports.getAvailableDevices = async () => {
    const devices = await Device.find(
        {
            status: "locked",
            state: "online"
        },
        { deviceId: 1, _id: 0 }
    );

    return devices.map(d => d.deviceId);
};

module.exports.cleanupOfflineDevices = async () => {

    const TIME_LIMIT = Number(process.env.DEVICE_OFFLINE_TIMEOUT) || 60000;

    const devices = await Device.find();

    for (const device of devices) {

        if (!device.lastSeen) continue;

        const diff = Date.now() - new Date(device.lastSeen).getTime();

        if (diff > TIME_LIMIT && device.state !== "offline") {

            console.log(`🔴 ${device.deviceId} ficou OFFLINE`);

            device.state = "offline";
            await device.save();
        }

        if (diff <= TIME_LIMIT && device.state !== "online") {

            console.log(`🟢 ${device.deviceId} voltou ONLINE`);

            device.state = "online";
            await device.save();
        }
    }
};