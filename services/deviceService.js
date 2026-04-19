const Device = require('../models/Device');

module.exports.registerDevice = async (deviceId) => {
    return await Device.findOneAndUpdate(
        { deviceId },
        { lastSeen: new Date() },
        { upsert: true, new: true }
    );
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