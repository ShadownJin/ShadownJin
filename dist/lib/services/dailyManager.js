import admin from "firebase-admin";
import { initFirestore } from "../database/firestore.js";
const db = initFirestore();
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24h
const BASE_DAILY_REWARD = Math.floor(Math.random() * 1201) + 300; // 300 - 1200 souls
/**
 * DAILY
 */
export async function claimDaily(userId) {
    const userRef = db.collection("users").doc(userId);
    const snaps = await userRef.get();
    const now = Date.now();
    if (!snaps.exists) {
        await userRef.set({
            souls: BASE_DAILY_REWARD,
            lastDaily: now,
        });
        return {
            sucess: true,
            reward: BASE_DAILY_REWARD,
        };
    }
    const data = snaps.data();
    const lastDaily = data.lastDaily || 0;
    if (now - lastDaily < DAILY_COOLDOWN) {
        return {
            sucess: false,
            remaining: DAILY_COOLDOWN - (now - lastDaily),
        };
    }
    await userRef.update({
        souls: admin.firestore.FieldValue.increment(BASE_DAILY_REWARD),
        lastDaily: now,
    });
    return {
        sucess: true,
        reward: BASE_DAILY_REWARD,
    };
}
