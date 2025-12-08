import { UserData } from "../structs/types/firestore.js";
import { initFirestore } from "./firestore.js";
import { DocumentReference, Firestore } from "firebase-admin/firestore";

// --- Tipagem de Dados (incluída acima para contexto) ---
type Snowflake = string;

// --- Configuração ---
const db: Firestore = initFirestore();
const COOLDOWN: number = 60 * 1000; // 60 Segundos
const inCooldown = new Map<Snowflake, number>();

// --- Funções Principais ---
/**
 * @param guildId
 * @param userId
 * @param amount
 * @returns
 */
export async function addXp(guildId: Snowflake, userId: Snowflake, amount: number): Promise<UserData> {
    const id: string = `${guildId}_${userId}`;

    // Tipando a referência do documento
    const ref: DocumentReference<UserData> = db.collection('users').doc(id) as DocumentReference<UserData>;
    const snap = await ref.get();
    
    let data: UserData;
    if (snap.exists) {
        data = snap.data() as UserData;
    } else {
        data = {
            xp: 0,
            messages: 0,
            userId,
            guildId,
            createAt: new Date()
        };
    }

    // Atualiza os dados
    data.xp = (data.xp || 0) + amount;
    data.messages = (data.messages || 0) + 1;
    data.updateAt = new Date();

    // Salva na DB
    await ref.set(data, {
        merge: true
    });
    return data;
}

/**
 * @param userId
 * @returns
 */
export function canGain(userId: Snowflake): boolean {
    const last: number = inCooldown.get(userId) || 0;

    // Verifica se a diferença de tempo é menor que o COOLDOWN
    if (Date.now() - last < COOLDOWN) {
        return false
    }

    // Atualiza o cooldown
    inCooldown.set(userId, Date.now());
    return true;
}

/**
 * @param xp
 * @returns
 */
export function xpToLevel(xp: number = 0): number {
    return Math.floor(0.1 * Math.sqrt(xp));
}