module.exports = {
    TIME_LIMIT: Number(process.env.QUEUE_TIME_LIMIT) || 120000,
    REJOIN_LIMIT: Number(process.env.QUEUE_REJOIN_LIMIT) || 0,
    REJOIN_COOLDOWN: Number(process.env.QUEUE_REJOIN_COOLDOWN) || 0
};