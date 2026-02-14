import {
  EmbedBuilder,
  MessageFlags,
  GuildMember,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

import type { Command } from "../../structs/types/client.js";

const userInfoCommand: Command = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("[INFO] Mostra informações do usuário")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Escolha o usuário que deseja ver informação"),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const target = interaction.options.getUser("user") || interaction.user;
      const guild = interaction.guild;

      // Verifica se o comando está sendo executado dentro de um servidor!
      if (!guild) {
        await interaction.reply({
          content: "Este comando só pode ser executado dentro de servidores",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Pega o usuário dentro do servidor
      const member: GuildMember = await guild.members.fetch(target.id);
      const nicknameMember = member.nickname || "-";

      const userInfoEmbed = new EmbedBuilder()
        .setTitle(`Informações do Usuário: ${member.user.username}`)
        .setThumbnail(target.displayAvatarURL({ size: 1024 }))
        .setColor("#0099FF")
        .addFields(
          { name: "👤 Nome do Usuário:", value: `\`${target.username}\``, inline: true },
          { name: "👤 Nome Exibição:", value: `\`${target.displayName}\``, inline: true },
          { name: "👤 Nick no Servidor:", value: `\`${nicknameMember}\``, inline: true },
          { name: "🆔 ID do Usuário:", value: `\`${target.username}\``, inline: true },
          { name: "🖼️ Avatar:", value: `[Avatar](${target.displayAvatarURL()})`, inline: true},
          {
            name: "📅 Conta Criada em",
            value: `\`${target.createdAt.toLocaleString("pt-BR")}\``,
            inline: false,
          },
        );

      const memberInfoEmbed = new EmbedBuilder()
        .setTitle("Informações como Membro")
        .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
        .setColor("#0099FF")
        .addFields(
          {
            name: "📅 Entrou no servidor em",
            value: `\`${member.joinedAt?.toLocaleString("pt-BR") || "Indefinido"}\``,
            inline: true,
          },
          {
            name: "💎 Está dando Boost?",
            value: member.premiumSince
              ? `Sim - desde **${member.premiumSince.toLocaleString("pt-BR")}**`
              : "Não",
            inline: true,
          },
          {
            name: "🔰 Cargo mais alto",
            value: `${member.roles.highest}`,
            inline: true,
          },
        );

      await interaction.reply({
        embeds: [userInfoEmbed, memberInfoEmbed],
      });
    } catch (error) {
      console.error("Erro ao executar userinfo: ", error);
      const msg = "Erro ao processar o comando.";

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: msg,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: msg,
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default userInfoCommand;
