// src/lib/firestore.ts

import admin from 'firebase-admin'
import { Firestore } from 'firebase-admin/firestore';

/**
 * Inicializa e retorna a instância do Firestore.
 */
export function initFirestore(): Firestore {
    // 1. Verificamos se JÁ existe uma aplicação padrão.
    // Usamos 'admin.apps.some()' para verificar a existência da aplicação default ([DEFAULT]).
    const defaultAppExists = admin.apps.some(app => app && app.name === '[DEFAULT]');

    if (!defaultAppExists) {
        
        // Se a app NÃO existir, inicializamos:
        const credentials = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        };
        
        // Verificação de credenciais (mantemos a robustez)
        if (!credentials.projectId || !credentials.clientEmail || !credentials.privateKey) {
            console.error("🔴 ERRO FIREBASE: Credenciais ausentes. Por favor, preencha o .env.");
            throw new Error("Credenciais do Firebase incompletas. Verifique o .env.");
        }

        admin.initializeApp({
            credential: admin.credential.cert(credentials as admin.ServiceAccount)
        });
    }
    
    // Retornamos o firestore.
    return admin.firestore();
}