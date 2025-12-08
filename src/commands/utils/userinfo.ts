import {
    Client,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder,
    MessageFlags,
    User,
    GuildMember,
    SlashCommandBuilder
} from 'discord.js';

import { ICommand } from '../../structs/types/client.js';

const userinfoCommand: ICommand = {
    name: 'userinfo',
    description: '[UTILS] Mostra informações do usuário.',
    category: 'Utils',
    meta: {
        type: ApplicationCommandType.ChatInput,
        guildOnly: true,
        permissions: [],
        cooldown: 5
    },
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        try {
            const target: User =
                interaction.options.getUser('usuario') || interaction.user;

            const guild = interaction.guild;
            if (!guild) {
                await interaction.reply({
                    content: 'Este comando só pode ser usado dentro de servidores.',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            const member: GuildMember = await guild.members.fetch(target.id);

            const userInfoEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Informações do Usuário')
                .setThumbnail(target.displayAvatarURL({ size: 1024 }))
                .addFields(
                    { name: '🆔 Discord ID', value: `\`${target.id}\``, inline: true },
                    { name: '💠 Nome', value: `\`${target.username}\``, inline: true },
                    { name: '📅 Conta criada em', value: `\`${target.createdAt.toLocaleString('pt-BR')}\``, inline: false }
                );

            const memberInfoEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Informações como Membro')
                .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
                .addFields(
                    {
                        name: '📅 Entrou no servidor em',
                        value: `\`${member.joinedAt?.toLocaleString('pt-BR') || 'Indefinido'}\``,
                        inline: true
                    },
                    {
                        name: '💎 Está dando Boost?',
                        value: member.premiumSince
                            ? `Sim – desde **${member.premiumSince.toLocaleString('pt-BR')}**`
                            : 'Não',
                        inline: true
                    },
                    {
                        name: '🔰 Cargo mais alto',
                        value: `${member.roles.highest}`,
                        inline: true
                    }
                );

            await interaction.reply({
                embeds: [userInfoEmbed, memberInfoEmbed]
            });

        } catch (error) {
            console.error('Erro ao executar userinfo:', error);

            const msg = 'Erro ao processar o comando.';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
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
    }
};

export default userinfoCommand;
