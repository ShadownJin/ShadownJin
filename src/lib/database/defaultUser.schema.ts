import admin from "firebase-admin";
import { UserData } from "../../structs/types/firebase.js";
import { DocumentData } from "firebase-admin/firestore";

export async function getOrCreateUser(userId: string): Promise<UserData> {
  const defaultUser = (userId: string): UserData => ({
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
  return snap.data() as UserData;
};

export async function getOrCreateWarningUser(userId: string, guildId: string): Promise<DocumentData> {
  const defaultWarningUser = (userId: string, guildId: string): DocumentData => ({
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
  return snap.data() as DocumentData;
}