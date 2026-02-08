import admin from "firebase-admin";
export async function createOnEnter(guildId, ownerId, guildName) {
    const defaultGuild = (guildId, ownerId, guildName) => ({
        guildId,
        ownerId,
        guildName,
        modules: {
            moderation: {
                enabled: true,
                logChannelId: null,
                staffRoleId: null,
                warningSystem: true
            },
        },
        createAt: new Date(),
    });
    const db = admin.firestore();
    const ref = db.collection("guilds").doc(String(guildId));
    const snap = await ref.get();
    if (!snap.exists) {
        const data = defaultGuild(guildId, ownerId, guildName);
        await ref.set(data);
        return data;
    }
    return snap.data();
}
