import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import type { Command, CustomClient } from "../../structs/types/client.js";
import { UserData } from "../../structs/types/firebase.js";
import { initFirestore } from "../../lib/firestore.js";
const db = initFirestore();

const DAILY_COOLDOWN = 1000 * 60 * 60 * 24;
const DAILY_REWARD = Math.floor(Math.random() * 1201) + 300; // 300 - 1201;

const dailyCommand: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('[ECONOMY] Pegue sua recompensa diária!'),
    async execute(interaction: any) {
        const userId = interaction.user.id;
        const userRef = db.collection('users').doc(userId);
        const now  =  Date.now();
        const snaps = await userRef.get();

        if (!snaps.exists) {
            await userRef.set({
                souls: DAILY_REWARD,
                lastDaily: now,
            });
            await interaction.reply(`✨ Você recebeu **${DAILY_REWARD} souls** pela primeira vez!`);
            return;
        };

        const data = snaps.data()!;
        const lastDaily = data.lastDaily ?? 0;
        const souls = data.souls ?? 0;

        const timePassed = now - lastDaily;

        // Ainda em cooldown
        if (timePassed < DAILY_COOLDOWN) {
            const remaining = DAILY_COOLDOWN - timePassed;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            await interaction.reply(`⏳ Você já coletou o daily.\nVolte em **${hours}h ${minutes}min**.`);
            return;
        };

        // Pode coletar
        await userRef.update({
            souls: souls + DAILY_REWARD,
            lastDaily: now
        });
        await interaction.reply(`🔥 Daily coletado! Você recebeu **${DAILY_REWARD} souls**`);
    }
};

export default dailyCommand;