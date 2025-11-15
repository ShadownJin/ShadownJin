const admin = require('firebase-admin');

function initFirestore() {
    if (admin.apps.length) return admin.firestore();
    admin.initializeApp({
        credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    });
    return admin.firestore();
}

module.exports = {initFirestore };