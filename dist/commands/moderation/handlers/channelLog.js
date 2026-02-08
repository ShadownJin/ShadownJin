import { EmbedBuilder, MessageFlags, } from "discord.js";
export async function ChannelLogConfig(interaction, guildRef) {
    const channel = interaction.options.getChannel("channel");
    // Set database
    await guildRef.set({
        modules: {
            moderation: {
                enabled: true,
                logChannelId: channel?.id,
            },
        },
        updatedAt: new Date(),
    }, { merge: true });
    const embedConfigChannel = new EmbedBuilder()
        .setTitle("⚙️ Configuração Atualizada")
        .setDescription(`O canal de log de moderação foi definido para ${channel}`)
        .setColor("#5865F2")
        .setFooter({ text: "Essas alterações refletirão no Dashboard em breve!" });
    interaction.reply({
        embeds: [embedConfigChannel],
        flags: MessageFlags.Ephemeral,
    });
}
