import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

export function initFirestore(): Firestore {
    // Verifica se já existe uma aplicação parrão
    const defaultAppExists = admin.apps.some(app => app && app.name === '[DEFAULT]');

    if (!defaultAppExists) {
        const credentials = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
        };

        if (!credentials.projectId || !credentials.clientEmail || !credentials.privateKey) {
            console.error("❌ ERRO FIREBASE: Credenciais ausentes. Por favor, preencha o .env");
            throw new Error("Credenciais do Firebase incomplentas. Verfique o .env");
        }

        admin.initializeApp({
            credential: admin.credential.cert(credentials as admin.ServiceAccount)
        });
        console.log("✅ Conexão com Banco de Dados Iniciada!")
    }
    return admin.firestore();
}