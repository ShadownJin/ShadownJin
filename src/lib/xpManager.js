const { initFirestore } = require('./firestore');
const db = initFirestore();

const COOLDOWN = 60 * 1000;
const inCooldown = new Map();

async function addXp(guildId, userId, amount) {
    const id = `${guildId}_${userId}`;
    const ref = db.collection('users').doc(id);
    const snap = await ref.get();
    let data = snap.exist ? snap.data() : {
        xp: 0,
        messages: 0,
        userId,
        guildId,
        createAt: new Date()
    };
    data.xp = (data.xp || 0) + amount;
    data.messages = (data.messages || 0) + 1;
    data.updateAt = new Date();
    await ref.set(data, { merge: true });
    return data;
}

function canGain(userId) {
    const last = inCooldown.get(userId) || 0;
    if (Date.now() - last < COOLDOWN) return false;
    inCooldown.set(userId, Date.now());
    return true;
}

function xpToLevel(xp = 0) {
    return Math.floor(0.1 * Math.sqrt(xp));
}

module.exports = { addXp, canGain, xpToLevel };