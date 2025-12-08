import {
    Client,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder,
    MessageFlags
} from "discord.js";

import { ICommand } from "../../structs/types/client.js";

const botinfo: ICommand = {
    name: "botinfo",
    description: "[UTILS] Mostra informações e estatísticas do bot.",
    category: "Utils",
    meta: {
        cooldown: 5,
        guildOnly: false,
        permissions: [],
        type: ApplicationCommandType.ChatInput
    },

    async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const uptimeMs = client.uptime || 0;

            const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
            const seconds = Math.floor((uptimeMs / 1000) % 60);

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🤖 Informações do Bot")
                .setThumbnail(client.user?.displayAvatarURL() || "")
                .addFields(
                    {
                        name: "🆔 Nome",
                        value: client.user?.tag || "Indefinido",
                        inline: true
                    },
                    {
                        name: "📌 ID",
                        value: client.user?.id || "Indefinido",
                        inline: true
                    },
                    {
                        name: "⏳ Uptime",
                        value: `\`${days}d ${hours}h ${minutes}m ${seconds}s\``,
                        inline: true
                    },
                    {
                        name: "📡 Servidores",
                        value: `\`${client.guilds.cache.size}\``,
                        inline: true
                    },
                    {
                        name: "👥 Usuários (aprox.)",
                        value: `\`${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}\``,
                        inline: true
                    },
                    {
                        name: "🧠 Versão Node",
                        value: `\`${process.version}\``,
                        inline: true
                    },
                    {
                        name: "📚 Discord.js",
                        value: `\`v14\``,
                        inline: true
                    }
                )
                .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

        } catch (e) {
            console.error("Erro ao executar botinfo:", e);

            const msg = "Erro ao processar o comando.";

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: msg, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
            }
        }
    }
};

export default botinfo;
