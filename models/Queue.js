const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    deviceId: { type: String, required: true },

    status: {
        type: String,
        enum: ["waiting", "active", "done", "cancelled", "expired"],
        default: "waiting"
    },

    joinedAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Queue', queueSchema);