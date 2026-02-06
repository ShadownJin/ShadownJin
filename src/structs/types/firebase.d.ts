import { DocumentData } from "firebase-admin/firestore";

export interface UserData extends DocumentData {
    xp: number;
    level: number;
    reputation: number;
    souls: number;
    messages: number;
    userId: string;
    createAt: Date;
    updateAt?: Date;
}