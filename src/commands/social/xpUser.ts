import {
    Client,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder
} from "discord.js";

import { ICommand } from "../../structs/types/client.js";
import {
    getUserXp,
    xpToNextLevel,
    getUserRank
} from "../../lib/xpManager.js";

const xpUser: ICommand = {
    name: "xpuser",
    description: "Mostra o perfil de XP de um usuário",
    category: "Utils",
    meta: {
        cooldown: 5,
        type: ApplicationCommandType.ChatInput,
        permissions: [],
        guildOnly: true
    },

    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const user =
            interaction.options.getUser("usuario") || interaction.user;

        const guildId = interaction.guildId!;
        const data = await getUserXp(guildId, user.id);

        if (!data) {
            await interaction.reply({
                content: "Esse usuário ainda não possui XP.",
                ephemeral: true
            });
            return;
        }

        const xpInfo = xpToNextLevel(data.xp);
        const rank = await getUserRank(guildId, user.id);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL()
            })
            .setTitle("📊 Perfil de XP")
            .addFields(
                { name: "⭐ Nível", value: `${xpInfo.level}`, inline: true },
                { name: "✨ XP Total", value: `${data.xp}`, inline: true },
                { name: "🏆 Ranking", value: `#${rank}`, inline: true },
                {
                    name: "🔜 Próximo nível",
                    value:
                        `${xpInfo.currentXp}/${xpInfo.nextLevelXp} XP\n` +
                        `Faltam ${xpInfo.remainingXp} XP`
                }
            )
            .setFooter({ text: "Continue interagindo para ganhar XP" })
            .setColor(0x5865f2);

        await interaction.reply({ embeds: [embed] });
    }
};

export default xpUser;
