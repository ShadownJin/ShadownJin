import admin from 'firebase-admin';
import { UserData } from '../../structs/types/firebase.js';

export async function getOrCreateUser(userId: string): Promise<UserData> {
    const defaultUser = (userId: string): UserData => ({
        xp: 0,
        level: 1,
        reputation: 0,
        souls: 0,
        messages: 0,
        userId,
        lastDaily: 0,
        createAt: new Date()
    })


    const db = admin.firestore();
    const ref = db.collection('users').doc(String(userId));
    const snap = await ref.get();

    if (!snap.exists) {
        const data = defaultUser(userId);
        await ref.set(data);
        return data;
    }
    return snap.data() as UserData;
}