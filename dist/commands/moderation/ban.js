import { PermissionFlagsBits, SlashCommandBuilder, MessageFlags, EmbedBuilder, } from "discord.js";
import { initFirestore } from "../../lib/database/firestore.js";
const db = initFirestore();
const banCommand = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("[MODERATION] Use para banir alguem do servidor!")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("Usuário a ser banido")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("reason")
        .setDescription("Motivo do banimento")
        .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "Nenhum motivo fornecido";
        const { guild } = interaction;
        if (!guild || !target)
            return;
        // Pega o usuário
        const member = await guild.members.fetch(target.id);
        // Verifica se é possivel banir
        if (!member.bannable) {
            interaction.reply({
                content: "❌ Eu não posso banir esse usuário.\nEle pode ter cargo maior que o meu!",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        // Realiza o banimento
        await member.ban({ reason });
        // Criação da log
        const guildDoc = await db.collection("guilds").doc(guild.id).get();
        const config = guildDoc.data();
        const logChannelId = config?.modules?.moderation?.logChannelId;
        const logEmbed = new EmbedBuilder()
            .setTitle("✈️ Usuário Banido")
            .setColor("#FF0000")
            .addFields({
            name: "Usuario",
            value: `${target.tag} (${target.id})`,
            inline: true,
        }, {
            name: "Moderador",
            value: `${interaction.user.tag}`,
            inline: true,
        }, {
            name: "Razão",
            value: reason,
        })
            .setTimestamp();
        if (logChannelId) {
            const logChannel = guild.channels.cache.get(logChannelId);
            if (logChannel)
                logChannel.send({ embeds: [logEmbed] });
            return;
        }
        interaction.reply({
            embeds: [logEmbed],
        });
        return;
    },
};
export default banCommand;
