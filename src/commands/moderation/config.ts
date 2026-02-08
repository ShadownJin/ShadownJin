import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType
} from "discord.js";
import { Command } from "../../structs/types/client.js";
import { initFirestore } from "../../lib/database/firestore.js";
import { ChannelLogConfig } from "./handlers/channelLog.js";
import { RoleStaffConfig } from "./handlers/roleStaff.js";
const db = initFirestore();

const configCommand: Command = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("[CONFIG] Configurações do ShadownJin para o servidor!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    // GRUPO: Moderation
    .addSubcommandGroup((sub) =>
      sub
        .setName("moderation")
        .setDescription("Configura o sistema de moderação")
        // SUB: Configurar Canal
        .addSubcommand((cmd) =>
          cmd
            .setName("channel")
            .setDescription("Configurações de canais")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Canal oinde os log serão enviados!")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true),
            ),
        )
        // SUB: Configurar o Cargo Staff
        .addSubcommand((cmd) =>
          cmd
            .setName("rolestaff")
            .setDescription("Configura o cargo de administrator")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(
                  "Cargo que terá permissão para usar comandos de moderação",
                )
                .setRequired(true),
            ),
        ),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;
    const guildRef = db.collection("guilds").doc(guildId);

    if (group === "moderation") {
      // Lógica para Canal:
      if (subcommand == "channelLog") {
        await ChannelLogConfig(interaction, guildRef);
      }

      // Lógica para Cargo:
      if (subcommand === "rolestaff") {
        await RoleStaffConfig(interaction, guildRef);
      }
    }
  },
};

export default configCommand;
