import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Command } from "../../structs/types/client.js";
import { initFirestore } from "../../lib/firestore.js";
const db = initFirestore();

const kickCommand: Command = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("[MODERATION] Use para expulsar alguem do servidor!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Usuário a ser expulso")
        .setRequired(true),
    )
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("Motivo da expulsão")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "Nenhuma motivo fornecido";
    const { guild } = interaction;

    if (!guild || !target) return;

    const member = await guild.members.fetch(target.id);

    // Verifica se é possivel expulsar
    if (!member.kickable) {
      interaction.reply({
        content:
          "❌ Eu não posso banir esse usuário!\n Ele pode ter cargo maior que o meu!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    // Realiza a expulsão
    await member.kick(reason);

    //Criação da log
    const guildDoc = await db.collection("guilds").doc(guild.id).get();
    const config = guildDoc.data();
    const logChannelId = config?.modules?.moderation?.logChannelId;

    const logEmbed = new EmbedBuilder()
      .setTitle("✈️ Usuário Banido")
      .setColor("#FF0000")
      .addFields(
        {
          name: "Usuario",
          value: `${target.tag} (${target.id})`,
          inline: true,
        },
        { name: "Moderador", value: `${interaction.user.tag}`, inline: true },
        { name: "Razão", value: reason },
      )
      .setTimestamp();

    if (logChannelId) {
      const logChannel = guild.channels.cache.get(logChannelId) as TextChannel;
      if (logChannel) logChannel.send({ embeds: [logEmbed] });
      return;
    } else {
      interaction.reply({
        embeds: [logEmbed],
      });
      return;
    }
  },
};

export default kickCommand;