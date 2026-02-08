import admin from "firebase-admin";
export async function getOrCreateUser(userId) {
    const defaultUser = (userId) => ({
        xp: 0,
        level: 1,
        reputation: 0,
        souls: 0,
        messages: 0,
        userId,
        lastDaily: 0,
        createAt: new Date(),
        inventory: [],
    });
    const db = admin.firestore();
    const ref = db.collection("users").doc(String(userId));
    const snap = await ref.get();
    if (!snap.exists) {
        const data = defaultUser(userId);
        await ref.set(data);
        return data;
    }
    return snap.data();
}
;
export async function getOrCreateWarningUser(userId, guildId) {
    const defaultWarningUser = (userId, guildId) => ({
        warningCount: 0
    });
    const db = admin.firestore();
    const ref = db.collection('users').doc(String(userId)).collection('warning').doc(guildId);
    const snap = await ref.get();
    if (!snap.exists) {
        const data = defaultWarningUser(userId, guildId);
        await ref.set(data);
        return data;
    }
    return snap.data();
}
