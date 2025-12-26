import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    Client,
    PermissionResolvable,
} from "discord.js";

import { ICommand } from "../../structs/types/client.js"; 
import { Firestore } from 'firebase-admin/firestore';
import { initFirestore } from "../../lib/firestore.js";
const db: Firestore = initFirestore();

const DAILY_COOLDOWN = 1000 * 60 * 60 * 24; // 24h
const DAILY_REWARD = 100;

async function safeReply(
    interaction: ChatInputCommandInteraction,
    content: string,
    ephemeral = false
) {
    if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content });
    } else {
        await interaction.reply({ content, ephemeral });
    }
}

const command: ICommand = {
    name: "daily",
    description: "Receba suas almas diárias",
    category: "economy",
    meta: {
        cooldown: 0,
        type: ApplicationCommandType.ChatInput,
        permissions: [] as PermissionResolvable[],
        guildOnly: false,
    },

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const userId = interaction.user.id;
        const userRef = db.collection("users").doc(userId);
        const now = Date.now();

        const snap = await userRef.get();

        // Caso o usuário ainda não exista
        if (!snap.exists) {
            await userRef.set({
                souls: DAILY_REWARD,
                lastDaily: now,
            });

            await safeReply(
                interaction,
                `✨ Você recebeu **${DAILY_REWARD} almas** pela primeira vez!`,
                true
            );
            return;
        }

        const data = snap.data()!;
        const lastDaily = data.lastDaily ?? 0;
        const souls = data.souls ?? 0;

        const timePassed = now - lastDaily;

        // Ainda em cooldown
        if (timePassed < DAILY_COOLDOWN) {
            const remaining = DAILY_COOLDOWN - timePassed;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor(
                (remaining % (1000 * 60 * 60)) / (1000 * 60)
            );

            await safeReply(
                interaction,
                `⏳ Você já coletou o daily.\nVolte em **${hours}h ${minutes}min**.`,
                true
            );
            return;
        }

        // Pode coletar novamente
        await userRef.update({
            souls: souls + DAILY_REWARD,
            lastDaily: now,
        });

        await safeReply(
            interaction,
            `🔥 Daily coletado! Você recebeu **${DAILY_REWARD} almas**.`,
            true
        );
    },
};

export default command;
