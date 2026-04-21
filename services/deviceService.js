const Device = require('../models/Device');

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

module.exports.registerDevice = async (deviceId) => {

    let device = await Device.findOne({ deviceId });

    // 🔥 NOVO DEVICE
    if (!device) {
        device = await Device.create({
            deviceId,
            secret: generateSecret(),
            status: "locked",
            attempts: [],
            lastSeen: new Date()
        });

        console.log(`Novo cofre criado: ${deviceId} | senha: ${device.secret}`);

    } else {
        // 🔄 DEVICE EXISTENTE
        device.lastSeen = new Date();

        // segurança: garante que tenha senha
        if (!device.secret) {
            device.secret = generateSecret();
            device.status = "locked";
            device.attempts = [];
        }

        await device.save();
    }

    return device;
};

module.exports.updateStatus = async (deviceId, status) => {
    return await Device.findOneAndUpdate(
        { deviceId },
        {
            status,
            lastSeen: new Date()
        }
    );
};

module.exports.updateCommand = async (deviceId, commands) => {
    return await Device.findOneAndUpdate(
        { deviceId },
        {
            lastCommand: commands,
            lastSeen: new Date()
        }
    );
};

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

module.exports.getAllDevices = async () => {
    return await Device.find();
};

