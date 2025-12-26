import admin from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import { initFirestore } from "./firestore.js";

type Snowflake = string;

const db: Firestore = initFirestore();

const XP_COOLDOWN = 3 * 1000; // 3 segundos
const xpCooldown = new Map<Snowflake, number>();

// ----------------------
// XP
// ----------------------
export async function addXp(
  guildId: Snowflake,
  userId: Snowflake,
  amount: number
): Promise<{
  xp: number;
  messages: number;
  updatedAt: number;
}> {
  const userRef = db.collection("users").doc(userId);
  const guildRef = userRef.collection("guilds").doc(guildId);

  const now = Date.now();

  // garante usuário global (idempotente)
  await userRef.set(
    {
      createdAt: now
    },
    { merge: true }
  );

  // incrementa XP por guild (uma única operação)
  await guildRef.set(
    {
      xp: admin.firestore.FieldValue.increment(amount),
      messages: admin.firestore.FieldValue.increment(1),
      updatedAt: now
    },
    { merge: true }
  );

  const snap = await guildRef.get();
  return snap.data() as {
    xp: number;
    messages: number;
    updatedAt: number;
  };
}

// ----------------------
// Cooldown XP
// ----------------------
export function canGainXp(userId: Snowflake): boolean {
  const last = xpCooldown.get(userId) || 0;

  if (Date.now() - last < XP_COOLDOWN) {
    return false;
  }

  xpCooldown.set(userId, Date.now());
  return true;
}

// ----------------------
// Level math
// ----------------------
export function xpToLevel(xp = 0): number {
  return Math.floor(0.1 * Math.sqrt(xp));
}

export function levelToXp(level: number): number {
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

// ----------------------
// Get XP por guild
// ----------------------
export async function getUserXp(
  guildId: Snowflake,
  userId: Snowflake
): Promise<{
  xp: number;
  messages: number;
  updatedAt: number;
} | null> {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("guilds")
    .doc(guildId);

  const snap = await ref.get();
  return snap.exists ? (snap.data() as any) : null;
}

// ----------------------
// Rank por guild
// ----------------------
export async function getUserRank(
  guildId: Snowflake,
  userId: Snowflake
): Promise<number> {
  const snap = await db
    .collectionGroup("guilds")
    .where(admin.firestore.FieldPath.documentId(), "==", guildId)
    .orderBy("xp", "desc")
    .get();

  const index = snap.docs.findIndex(
    doc => doc.ref.parent.parent?.id === userId
  );

  return index === -1 ? snap.size : index + 1;
}
