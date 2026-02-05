import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client, MessageFlags } from "discord.js";

import ts from 'typescript';

import type { Command } from "../../structs/types/client.js";

const botInfoCommand: Command = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('[UTILS] Descubra mais sobre mim!'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // extends: client as Client
            const client = interaction.client as Client;

            // create: uptime string
            const upTimeMs = (interaction.client).uptime ?? 0;
            const seconds = Math.floor(upTimeMs / 1000) %60;
            const minutes = Math.floor(upTimeMs / (1000 * 60) % 60);
            const hours = Math.floor(upTimeMs / (1000 * 60 * 60) % 24);
            const days = Math.floor(upTimeMs / (1000 * 60 * 60 *24));
            const upTimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // create: TypeScript Version
            const tsVersion = ts.version;

            // import: emojis
            const nodeEmoji = "<:node:1468771697774690538>";
            const typeScriptEmoji = "<:typescript:1468771696692560053>";
            const discordJsEmoji = "<:discordjs:1468773616643608596>";

            // create: embed texto
            const botInfoEmbed = new EmbedBuilder()
                .setTitle('🤖 Sobre mim')
                .setColor('#5865F2')
                .setThumbnail(client.user?.displayAvatarURL() || "")
                .addFields(
                    { 
                        name: 'Sobre mim:', 
                        value: `Olá Guerreiro!\n
                        Eu sou o ShadownJin, fui criado para pelo <@${process.env.BOT_OWNER}> para se aprofundar nos estudo em programação!\n
                        Estou em constante evolução, recebendo melhorias e novas funcionalidades para facilitar a administração do servidor, oferecer jogos divertidos e manter a comunidade sempre ativa.\n
                        _Curiosidade: Fui baseado no protagonista do anime **Solo Leveling**_`}
                )

            // create: embed ténico
            const botTecnicoInfoEmbed = new EmbedBuilder()
                .setTitle('🔧 Informações Técnicas do Bot')
                .setColor('#5865F2')
                .setThumbnail(client.user?.displayAvatarURL() || "")
                .addFields(
                    { name: '📌 Nome', value: `\`${client.user?.tag}\`` || "Indefinido", inline: true },
                    { name: '🆔 ID', value: `\`${client.user?.id}\`` || "Indefinido", inline: true },
                    { name: '⏳ Uptime', value: upTimeStr, inline: true },
                    { name: '📡 Servidores', value: `\`${client.guilds.cache.size}\``, inline: true },
                    { name: '👥 Usuários (aprox.)', value: `\`${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}\``, inline: true },
                    { name: `${nodeEmoji} Node.JS`, value: `\`${process.version}\``, inline: true },
                    { name: `${typeScriptEmoji} TypeScript`, value: `\`${tsVersion}\``, inline: true },
                    { name: `${discordJsEmoji} Discord.js`, value: `\`v14\``, inline: true }
                )
                .setTimestamp()

            await interaction.reply({
                embeds: [botInfoEmbed, botTecnicoInfoEmbed]
            });
        } catch (error) {
            console.error('Erro ao executar botinfo: ', error);
            const msg = "Erro ao processar o comando";

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: msg, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
            }
        }
    }
}

export default botInfoCommand;