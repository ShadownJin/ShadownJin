import {
    ChatInputCommandInteraction,
    EmbedBuilder,
} from "discord.js"
import { DocumentData } from "firebase-admin/firestore";


export async function sloganConfig(
    interaction: ChatInputCommandInteraction,
    userRef: DocumentData,
) {
    const newSlogan = interaction.options.getString("frase");

    // Set database
    await userRef.update({
        "profile.slogan": newSlogan,
        updatedAt: new Date(),
        });

    // EMBED: Config
    const embedConfiSlogan = new EmbedBuilder()
        .setTitle("⚙️ Perfil Atualizado")
        .setDescription(`Sua nova frase de perfil foi atualizada pra:  \`${newSlogan}\``)
        .setColor("#5865F2")
        .setFooter({ text: "Essas alterações refletirão no Dashboard em breve!" });

    interaction.reply({
        embeds: [embedConfiSlogan]
    })
}