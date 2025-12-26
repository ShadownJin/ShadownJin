import { Message, Client } from "discord.js";
import { addXp, canGainXp } from "../lib/xpManager.js";
import { IEvent } from "../structs/types/client.js";

/**
 * Evento messageCreate
 * Responsável APENAS por conceder XP ao usuário
 */
const messageCreateEvent: IEvent = {
  name: "messageCreate",
  once: false,

  async execute(client: Client, message: Message): Promise<void> {
    // -------- Guards (retornos rápidos) --------
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.member) return;

    // -------- Cooldown --------
    if (!canGainXp(message.author.id)) return;

    // -------- XP --------
    const xpGain = Math.floor(Math.random() * 6) + 5; // 5–10 XP

    try {
      await addXp(
        message.guild.id,
        message.author.id,
        xpGain
      );
    } catch (error) {
      console.error(
        "[XP] Erro ao adicionar XP",
        {
          guildId: message.guild.id,
          userId: message.author.id,
          error
        }
      );
    }
  }
};

export default messageCreateEvent;