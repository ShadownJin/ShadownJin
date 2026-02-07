import { DocumentData } from "firebase-admin/firestore";

export interface UserData extends DocumentData {
    xp: number;
    level: number;
    reputation: number;
    souls: number;
    messages: number;
    userId: string;
    dailyCooldown: Date;
    createAt: Date;
    updateAt?: Date;
}

export interface GuildData extends DocumentData {
    guildId: string;
    ownerId: string;
    guildName: string;
    createAt: Date;
    UpdateAt?: Date;
}