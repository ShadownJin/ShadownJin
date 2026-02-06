import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { initFirestore } from './firestore.js';
import { getOrCreateUser } from './database/defaultUser.schema.js';

type SnowFlake = string;

const db: Firestore = initFirestore();

const XP_COOLDOWN = 5 * 1000; // 5 segundos
const xpCooldown = new Map<SnowFlake, number>();

export async function addXp(userId: SnowFlake, amount: number): Promise <{
    xp: number;
    messages: number;
    updateAt: number;
}> {
    await getOrCreateUser(userId);

    const userRef = db.collection("users").doc(userId);
    const now = Date.now();

    await userRef.update(
        { 
            xp: admin.firestore.FieldValue.increment(amount),
            messages: admin.firestore.FieldValue.increment(1),
            updatedAt: now
        }
    );

    const snap = await userRef.get();
    return snap.data() as {
        xp: number;
        messages: number;
        updateAt: number;
    };
}

/** COOLDOWN XP
 * 
 * @param userId 
 * @returns 
 */
export function canGainXp(userId: SnowFlake): boolean {
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
export function xpToLevel(xp = 0): number {
    return Math.floor(0.1 * Math.sqrt(xp));
}


export function levelToXp(level: number):number {
    return Math.pow(level / 0.1, 2);
}

export function xpToNextLevel(xp: number) {
    const level = xpToLevel(xp);
    const currentLevelXp = levelToXp(level);
    const nextLevelXp = levelToXp(level + 1);

    return {
        level,
        currentXp: xp - currentLevelXp,
        nextLevelXp: nextLevelXp - currentLevelXp,
        remainingXp: nextLevelXp - xp
    };
}