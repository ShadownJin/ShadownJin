import { MessageFlags } from 'discord.js';
import { addXp, canGainXp, xpToLevel } from '../lib/services/xpManager.js';
import { getOrCreateUser } from '../lib/database/defaultUser.schema.js';
import admin from 'firebase-admin';
const messageCreate = {
    name: 'messageCreate',
    async execute(client, message) {
        // --- Guards (Retorno Rapidos) ---
        if (message.author.bot)
            return;
        // --- Cooldown ---
        if (!canGainXp(message.author.id))
            return;
        // --- XP ---
        const xpGain = Math.floor(Math.random() * 16) + 7; // 7-15 xp;
        const userData = await getOrCreateUser(message.author.id);
        const oldLevel = xpToLevel(userData.xp);
        try {
            const newUserData = await addXp(message.author.id, xpGain);
            const newLevel = xpToLevel(newUserData.xp);
            // Se subiu de nível, atualiza no banco de dados
            if (newLevel > oldLevel) {
                const db = admin.firestore();
                await db.collection('users').doc(message.author.id).update({
                    level: newLevel
                });
                message.reply({
                    content: `🎉 Parabéns! Você subiu para o nível **${newLevel}**!`,
                    flags: [MessageFlags.SuppressNotifications]
                });
            }
        }
        catch (error) {
            console.error("[XP] Erro ao adicionar XP", {
                userId: message.author.id,
                error
            });
        }
    }
};
export default messageCreate;
