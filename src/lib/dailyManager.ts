import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { initFirestore } from './firestore.js';

type Snowflake = string;

const db: Firestore = initFirestore();

const DAILY_COOLDOWN = 24*60*60*1000 //24H
const BASE_DAILY_REWARD = Math.floor(Math.random() * 1501) + 300; // 300–1500 ALMAS

/** ----------------------
 * Daily
 ----------------------*/
export async function claimDaily(userId: Snowflake): Promise<{
    success: boolean;
    reward?: number;
    remaining?: number;
}> {
    const userRef = db.collection('users').doc(userId);
    const snap = await userRef.get();
    const now = Date.now();

    // usuário novo
    if(!snap.exists) {
        await userRef.set({
            almas: BASE_DAILY_REWARD,
            lastDaily: now,
            createAt: now
        });

        return {
            success: true,
            reward: BASE_DAILY_REWARD
        };
    }

    const data = snap.data() as {
        almas?: number;
        lastDaily?: number;
    };

    const lastDaily = data.lastDaily || 0;

    // Ainda em cooldown
    if (now - lastDaily < DAILY_COOLDOWN) {
        return  {
            success: false,
            remaining: DAILY_COOLDOWN - (now - lastDaily)
        };
    }

    // Coleta diaria
    await userRef.update({
        almas: admin.firestore.FieldValue.increment(BASE_DAILY_REWARD),
        lastDaily: now
    });

    return {
        success: true,
        reward: BASE_DAILY_REWARD
    };
}