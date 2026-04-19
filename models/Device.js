const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: { type: String, unique: true },
    state: { type: Object, default: {} },
    lastCommand: { type: Array, default: [] },
    lastSeen: { type: Date }
});

module.exports = mongoose.model('Device', deviceSchema);
