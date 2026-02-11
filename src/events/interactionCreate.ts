import type { CustomClient, Event } from "../structs/types/client.js";

// Cooldown
import { hasCooldown } from "../lib/utils/cooldown.js";
import { CooldownResult } from "../structs/types/client.js";
import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { handlerError } from "../lib/errors/erroHandler.js";

const interactionCreate: Event = {
  name: "interactionCreate",
  async execute(client: CustomClient, interaction: ChatInputCommandInteraction) {
    try {
      if (
        !interaction ||
        !interaction.isChatInputCommand ||
        !interaction.isChatInputCommand()
      )
        return;

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        await interaction.reply({
          content: "Comando não encontrado.",
          ephemeral: true,
        });
        return;
      }

      //Cooldown ---- REMOVIDO TEMPORARIAMENTE
      // const { cooldown } = interaction.client;

      // Verificação: Cooldown
      const cd: CooldownResult = hasCooldown({
        guildId: interaction.guildId!,
        userId: interaction.user.id,
        command: SlashCommandBuilder.name,
        seconds: command.cooldown || 3,
      });
      if (!cd.ok) {
        await interaction.reply({
          content: `Aguarde! Faltam ${cd.left} para usar esse comando novamente!`,
          flags: MessageFlags.Ephemeral// Ephemeral: True
        });
        return;
      }

      await command.execute(interaction);
    } catch (error) {
      await handlerError(error, interaction);

      /** --- REMOVIDO TEMPORARIAMENTE ----
      console.error("Erro ao processar interação:", err);
      try {
        if (interaction && !interaction.replied)
          await interaction.reply({
            content: "Erro ao executar o comando.",
            ephemeral: true,
          });
      } catch {
        console.log("Ue.....")
      }
    */

    }
  },
};

export default interactionCreate;
