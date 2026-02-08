// Cooldown
import { hasCooldown } from "../lib/utils/cooldown.js";
import { SlashCommandBuilder } from "discord.js";
const interactionCreate = {
    name: "interactionCreate",
    async execute(client, interaction) {
        try {
            if (!interaction ||
                !interaction.isChatInputCommand ||
                !interaction.isChatInputCommand())
                return;
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                await interaction.reply({
                    content: "Comando não encontrado.",
                    ephemeral: true,
                });
                return;
            }
            //Cooldown
            const { cooldown } = interaction.client;
            // Verificação: Cooldown
            const cd = hasCooldown({
                guildId: interaction.guildId,
                userId: interaction.user.id,
                command: SlashCommandBuilder.name,
                seconds: command.cooldown || 3,
            });
            if (!cd.ok) {
                await interaction.reply({
                    content: `Aguarde! Faltam ${cd.left} para usar esse comando novamente!`,
                    MessageFlags: 64, // Ephemeral: True
                });
                return;
            }
            await command.execute(interaction);
        }
        catch (err) {
            console.error("Erro ao processar interação:", err);
            try {
                if (interaction && !interaction.replied)
                    await interaction.reply({
                        content: "Erro ao executar o comando.",
                        ephemeral: true,
                    });
            }
            catch { }
        }
    },
};
export default interactionCreate;
