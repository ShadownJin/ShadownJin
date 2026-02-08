import admin from "firebase-admin";
import { initFirestore } from "../database/firestore.js";
import { getOrCreateUser } from "../database/defaultUser.schema.js";
const db = initFirestore();
const XP_COOLDOWN = 5 * 1000; // 5 segundos
const xpCooldown = new Map();
export async function addXp(userId, amount) {
    await getOrCreateUser(userId);
    const userRef = db.collection("users").doc(userId);
    const now = Date.now();
    await userRef.update({
        xp: admin.firestore.FieldValue.increment(amount),
        messages: admin.firestore.FieldValue.increment(1),
        updatedAt: now,
    });
    const snap = await userRef.get();
    return snap.data();
}
/** COOLDOWN XP
 *
 * @param userId
 * @returns
 */
export function canGainXp(userId) {
    const last = xpCooldown.get(userId) || 0;
    if (Date.now() - last < XP_COOLDOWN) {
        return false;
    }
    xpCooldown.set(userId, Date.now());
    return true;
}
/** LEVEL MATH
 *
 * @param xp
 * @returns
 */
export function xpToLevel(xp = 0) {
    return Math.floor(0.1 * Math.sqrt(xp));
}
export function levelToXp(level) {
    return Math.pow(level / 0.1, 2);
}
export function xpToNextLevel(xp) {
    const level = xpToLevel(xp);
    const currentLevelXp = levelToXp(level);
    const nextLevelXp = levelToXp(level + 1);
    return {
        level,
        currentXp: xp - currentLevelXp,
        nextLevelXp: nextLevelXp - currentLevelXp,
        remainingXp: nextLevelXp - xp,
    };
}
