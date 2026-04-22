const Device = require('../models/Device');
const Queue = require('../models/Queue');

// =====================
// VALIDAR JOGADA
// =====================
function validateGuess(guess) {
    if (!guess || guess.length !== 4) {
        throw new Error("A senha deve ter 4 dígitos");
    }

    if (!/^\d+$/.test(guess)) {
        throw new Error("A senha deve conter apenas números");
    }

    const unique = new Set(guess);
    if (unique.size !== 4) {
        throw new Error("Não pode repetir números");
    }
}

// =====================
// CALCULAR RESULTADO
// =====================
function calculateResult(secret, guess) {
    let otimos = 0;
    let bons = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            otimos++;
        } else if (secret.includes(guess[i])) {
            bons++;
        }
    }

    return { otimos, bons };
}

// =====================
// VERIFICAR SE PODE JOGAR
// =====================
async function validatePlayer(userId, deviceId) {
    const active = await Queue.findOne({
        deviceId,
        userId,
        status: "active"
    });

    if (!active) {
        throw new Error("Usuário não está autorizado a jogar");
    }
}

// =====================
// ENVIAR COMANDO PARA ESP
// =====================
function sendUnlockCommand(deviceId, clients) {
    console.log("Clients disponíveis:", Object.keys(clients));

    const client = clients[deviceId];

    if (!client) {
        console.log("ESP não conectado no momento ❌");
        return;
    }

    if (client.readyState !== 1) {
        console.log("ESP não pronto ❌");
        return;
    }

    console.log("Enviando comando OPEN 🔥");

    client.send(JSON.stringify({
        type: "batch",
        commands: [
            { command: "LOCK", value: "OPEN" }
        ]
    }));
}
// =====================
// FAZER JOGADA
// =====================
module.exports.makeGuess = async (userId, deviceId, guess, clients) => {

    console.log("BODY:", guess);
    console.log("TYPE:", typeof guess);

    validateGuess(guess);
    await validatePlayer(userId, deviceId);

    const device = await Device.findOne({ deviceId });

    console.log("SECRET:", device.secret);

    const MAX_OFFLINE_TIME = 10000; // 10s

    if (!device.lastSeen || (Date.now() - new Date(device.lastSeen).getTime()) > MAX_OFFLINE_TIME) {
        throw new Error("Cofre offline");
    }

    // 🚫 bloqueado
    if (device.status === "blocked") {
        throw new Error("Cofre bloqueado");
    }

    if (device.status === "unlocked") {
        throw new Error("Cofre já foi aberto");
    }

    const { otimos, bons } = calculateResult(device.secret, guess);

    // salva tentativa
    device.attempts.push({
        userId,
        guess,
        otimos,
        bons
    });

    // 🎉 venceu
    let win = false;

    if (otimos === 4  && !device.openedBy) {
        win = true;

        device.status = "unlocked";

        // 🔥 SALVA QUEM ABRIU
        device.openedBy = userId;
        device.openedAt = new Date();

        // envia comando pro ESP
        sendUnlockCommand(deviceId, clients);

        // trava depois
        device.status = "blocked";
    }

    await device.save();

    return {
        otimos,
        bons,
        win,
        attempts: device.attempts.length
    };
};

// =====================
// ESTADO DO COFRE
// =====================
module.exports.getDeviceState = async (deviceId) => {
    const device = await Device.findOne({ deviceId });

    if (!device) throw new Error("Cofre não encontrado");

    return {
        status: device.status,
        attempts: device.attempts.length
    };
};

// =====================
// RESET (ADMIN)
// =====================
module.exports.resetDevice = async (deviceId) => {

    const generateSecret = () => {
        const numbers = [];

        while (numbers.length < 4) {
            const n = Math.floor(Math.random() * 10).toString();
            if (!numbers.includes(n)) numbers.push(n);
        }

        return numbers.join('');
    };

    const device = await Device.findOne({ deviceId });

    if (!device) throw new Error("Cofre não encontrado");

    device.secret = generateSecret();
    device.status = "locked";
    device.attempts = [];

    await device.save();

    return {
        message: "Cofre resetado com nova senha"
    };
};