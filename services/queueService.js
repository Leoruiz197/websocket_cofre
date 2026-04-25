const Queue = require('../models/Queue');

const {
    TIME_LIMIT,
    REJOIN_LIMIT,
    REJOIN_COOLDOWN
} = require('../config/queue');

// =====================
// AUX
// =====================

async function isUserActive(userId, deviceId) {
    return await Queue.findOne({
        userId,
        deviceId,
        status: { $in: ["waiting", "active"] }
    });
}

async function getLastExit(userId, deviceId) {
    return await Queue.findOne({
        userId,
        deviceId,
        status: { $in: ["done", "cancelled", "expired"] }
    }).sort({ finishedAt: -1 });
}

async function getRejoinCount(userId, deviceId) {
    return await Queue.countDocuments({
        userId,
        deviceId
    });
}

// =====================
// JOIN
// =====================

module.exports.joinQueue = async (userId, deviceId) => {

    const active = await isUserActive(userId, deviceId);
    if (active) throw new Error("Usuário já está na fila");

    return await Queue.create({ userId, deviceId });
};

// =====================
// REJOIN (COM REGRA)
// =====================

module.exports.rejoinQueue = async (userId, deviceId) => {

    const active = await isUserActive(userId, deviceId);
    if (active) throw new Error("Usuário já está na fila");

    // cooldown
    const last = await getLastExit(userId, deviceId);
    if (last && REJOIN_COOLDOWN > 0) {
        const diff = Date.now() - new Date(last.finishedAt).getTime();

        if (diff < REJOIN_COOLDOWN) {
            throw new Error("Aguarde para reentrar na fila");
        }
    }

    // limite
    if (REJOIN_LIMIT > 0) {
        const count = await getRejoinCount(userId, deviceId);

        if (count >= REJOIN_LIMIT) {
            throw new Error("Limite de reentrada atingido");
        }
    }

    return await module.exports.joinQueue(userId, deviceId);
};

// =====================
// LEAVE
// =====================

module.exports.leaveQueue = async (userId, deviceId) => {

    const entry = await Queue.findOne({
        userId,
        deviceId,
        status: { $in: ["waiting", "active"] }
    });

    if (!entry) throw new Error("Usuário não está na fila");

    entry.status = "cancelled";
    entry.finishedAt = new Date();

    await entry.save();

    if (entry.status === "active") {
        await module.exports.callNext(deviceId);
    }

    return entry;
};

// =====================
// CALL NEXT
// =====================

module.exports.startNext = async (deviceId) => {

    // 1. verifica se já tem alguém ativo
    const active = await Queue.findOne({
        deviceId,
        status: "active"
    });

    if (active) {
        throw new Error("Já existe um usuário ativo nesse dispositivo");
    }

    // 2. pega o primeiro da fila
    const next = await Queue.findOne({
        deviceId,
        status: "waiting"
    }).sort({ joinedAt: 1 });

    if (!next) {
        return null; // fila vazia
    }

    // 3. ativa o usuário
    next.status = "active";
    next.startedAt = new Date();

    await next.save();

    return next;
};

// =====================
// FINISH
// =====================

module.exports.finishTurn = async (deviceId) => {

    // 1. encontra quem está ativo
    const active = await Queue.findOne({
        deviceId,
        status: "active"
    });

    if (!active) {
        throw new Error("Nenhum usuário ativo");
    }

    // 2. finaliza
    active.status = "done";
    active.finishedAt = new Date();

    await active.save();

    // 3. chama próximo automaticamente
    const next = await Queue.findOne({
        deviceId,
        status: "waiting"
    }).sort({ joinedAt: 1 });

    if (next) {
        next.status = "active";
        next.startedAt = new Date();
        await next.save();
    }

    return {
        finished: active,
        next: next || null
    };
};

// =====================
// EXPIRE
// =====================

module.exports.expireTurn = async (deviceId) => {

    const active = await Queue.findOne({
        deviceId,
        status: "active"
    });

    if (!active || !active.startedAt) return null;

    const elapsed = Date.now() - new Date(active.startedAt).getTime();

    if (elapsed > TIME_LIMIT) {
        active.status = "expired";
        active.finishedAt = new Date();

        await active.save();

        await module.exports.callNext(deviceId);
    }

    return active;
};

// =====================
// GET QUEUE
// =====================

module.exports.getQueue = async (deviceId) => {

    return await Queue.find({
        deviceId,
        status: { $in: ["waiting", "active"] }
    }).sort({ joinedAt: 1 });
};

module.exports.getUserPosition = async (userId, deviceId) => {

    const queue = await Queue.find({
        deviceId,
        status: { $in: ["waiting", "active"] }
    }).sort({ joinedAt: 1 });

    const index = queue.findIndex(q => q.userId.toString() === userId);

    if (index === -1) return null;

    return {
        position: index + 1,
        total: queue.length,
        status: queue[index].status
    };
};

module.exports.cleanupWaitingFirst = async () => {

    console.log("📡 Verificando filas...");

    const devices = await Queue.distinct("deviceId");

    for (const deviceId of devices) {

        // 🔥 pega o primeiro da fila
        const first = await Queue.findOne({
            deviceId,
            status: "waiting"
        }).sort({ createdAt: 1 });

        if (!first) continue;

        const referenceTime = first.becameFirstAt || first.createdAt;

        if (!referenceTime) {
            console.log("❌ Sem tempo de referência");
            continue;
        }

        const diff = Date.now() - new Date(referenceTime).getTime();

        console.log(`⏱ ${deviceId} | user ${first.userId} | tempo: ${diff}`);

        // 🔥 EXPIRA
        if (diff > TIME_LIMIT) {

            console.log(`⏰ Expirando ${first.userId}`);

            first.status = "expired";
            first.expiredAt = new Date();

            await first.save();

            // ============================
            // 🔥 PROMOVE O PRÓXIMO
            // ============================

            const next = await Queue.findOne({
                deviceId,
                status: "waiting"
            }).sort({ createdAt: 1 });

            if (next) {
                next.becameFirstAt = new Date();
                await next.save();

                console.log(`➡️ Novo primeiro: ${next.userId}`);
            } else {
                console.log("📭 Fila vazia");
            }
        }
    }
};