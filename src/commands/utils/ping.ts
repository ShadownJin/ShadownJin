import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../../structs/types/client.js";

const pingCommand: Command = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("[UTILS] Responde com pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!");
  },
};

export default pingCommand;
