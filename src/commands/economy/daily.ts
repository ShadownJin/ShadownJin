import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../structs/types/client.js";
import { getOrCreateUser } from "../../lib/database/defaultUser.schema.js";
import { initFirestore } from "../../lib/database/firestore.js";

const db = initFirestore();

const DAILY_COOLDOWN = 1000 * 60 * 60 * 24; // 24 Horas
const DAILY_REWARD = Math.floor(Math.random() * 1201) + 300; // Valor entre 300 e 1500

const dailyCommand: Command = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("[ECONOMY] Pegue sua recompensa diária!"),

  async execute(interaction: any) {
    const userId = interaction.user.id;
    const now = Date.now();

    // 1. Obtemos os dados do utilizador (Cria se não existir)
    const userData = await getOrCreateUser(userId);

    // Referência para podermos atualizar os dados depois
    const userRef = db.collection("users").doc(userId);

    const lastDaily = userData.lastDaily ?? 0;
    const currentSouls = userData.souls ?? 0;

    // 2. Lógica de Cooldown
    const timePassed = now - lastDaily;

    if (timePassed < DAILY_COOLDOWN && lastDaily !== 0) {
      const remaining = DAILY_COOLDOWN - timePassed;
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      return await interaction.reply({
        content: `⏳ Você já coletou o daily.\nVolte em **${hours}h ${minutes}min**.`,
        flags: MessageFlags.Ephemeral, // Opcional: apenas o utilizador vê
      });
    }

    // 3. Atualização do Banco de Dados
    const isFirstTime = lastDaily === 0;
    const newSoulsValue = currentSouls + DAILY_REWARD;

    await userRef.update({
      souls: newSoulsValue,
      lastDaily: now,
    });

    // 4. Resposta ao Utilizador
    if (isFirstTime) {
      await interaction.reply(
        `✨ Bem-vindo ao sistema! Você recebeu **${DAILY_REWARD} souls** pela primeira vez!`,
      );
    } else {
      await interaction.reply(
        `🔥 Daily coletado! Você recebeu **${DAILY_REWARD} souls**. Total: **${newSoulsValue}**`,
      );
    }
  },
};

export default dailyCommand;
