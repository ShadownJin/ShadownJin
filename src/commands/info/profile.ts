import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from "discord.js";
import type { Command } from "../../structs/types/client.js";
import { getOrCreateUser } from "../../lib/database/defaultUser.schema.js";

const profileCommand: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("[INFO] Mostra perfil de um usuário")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Escolha o usuário que deseja ver o perfil!")
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // Verifica se está executando em guild
            const guild = interaction.guild;
            if (!guild) {
                await interaction.reply({
                    content: "Este comando só pode ser executado dentro de servidores",
                    flags: MessageFlags.Ephemeral
                });
                return;
            }
            // Pega o usuario target
            const target = interaction.options.getUser("user") || interaction.user;
            const avatarUrl = target.displayAvatarURL();
            
            // Infos da DataBase
            const userData = await getOrCreateUser(target.id);
            const level = userData.level ?? 0;
            const xp = userData.xp ?? 0;
            const souls = userData.souls ?? 0;
            const slogan = userData.profile.slogan;
            
            const profileEmbed = new EmbedBuilder()
                .setTitle("Bem-Vindo ao meu Perfil!")
                .setDescription(
                    `> *\`${slogan}\`*\n\n**Informações do Usuário**\nEste é o cartão de perfil oficinal de **${target.username}**.`
                )
                .setAuthor({
                    name: `Perfil de ${target.username}`,
                    iconURL: avatarUrl
                })
                .setFooter({
                    text: `Solicitado por ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setImage(target.displayAvatarURL())
                .setThumbnail(target.displayAvatarURL({ size: 1024 }))
                .setColor(5793266)
                .addFields(
                    { 
                        name: "🆔 Identificação:",
                        value: `\`${target.id}\``,
                        inline: false
                    },
                    {
                        name: "🏷️ Tag:",
                        value: `\`${target.tag}\``,
                        inline: false
                    },
                    { 
                        name: "🏆 Estastísticas e Nível", 
                        value: "```yml\nNível: " +level+ " | XP: " +xp+ "\nSouls: " +souls+ "\n```", 
                        inline: false 
                    }
                );

            await interaction.reply({
                embeds: [profileEmbed]
            });
            return;
        } catch (error) {
            console.error("Erro ao executar userinfo: ", error);
            const msg = "Erro ao processar o comando.";

            if (interaction.replied || interaction.deferred) {
                await interaction.reply({
                    content: msg,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: msg,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};

export default profileCommand;