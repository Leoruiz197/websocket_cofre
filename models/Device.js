const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },

    // 🔐 senha do cofre
    secret: { type: String },

    state: {
        type: String,
        enum: ["online", "offline"],
        default: "offline"
    },

    // estado do cofre
    status: {
        type: String,
        enum: ["locked", "unlocked", "blocked"],
        default: "locked"
    },
    openedBy: {
    type: String
    },
    openedAt: {
        type: Date
    },

    // histórico de tentativas
    attempts: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            guess: { type: String, required: true },
            otimos: { type: Number, required: true },
            bons: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    lastSeen: Date
});

module.exports = mongoose.model('Device', deviceSchema);