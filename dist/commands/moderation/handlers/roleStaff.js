import { EmbedBuilder, MessageFlags, } from "discord.js";
export async function RoleStaffConfig(interaction, guildRef) {
    const role = interaction.options.getRole("role");
    // Set database
    await guildRef.set({
        modules: {
            moderation: {
                enabled: true,
                staffRoleId: role?.id,
            },
        },
        updatedAt: new Date(),
    }, { merge: true });
    const embedConfigRole = new EmbedBuilder()
        .setTitle("⚙️ Configuração Atualizada")
        .setDescription(`O cargo de moderação foi definido para <@&${role?.id}>`)
        .setColor("#5865F2")
        .setFooter({ text: "Essas alterações refletirão no Dashboard em breve!" });
    interaction.reply({
        embeds: [embedConfigRole],
        flags: MessageFlags.Ephemeral,
    });
}
