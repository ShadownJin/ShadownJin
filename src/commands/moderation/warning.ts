import { 
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    MessageFlags,
    EmbedBuilder,
    TextChannel,
    GuildMember
} from "discord.js";
import { Command } from "../../structs/types/client.js";
import { initFirestore } from "../../lib/database/firestore.js";
import { count } from "node:console";
import { FieldValue } from "firebase-admin/firestore";
const db = initFirestore();

const warningCommand: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('warning')
        .setDescription('[MODERATION] Use para dar um aviso a um usuário!')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Usuário que receberá um aviso')
                .setRequired(true),
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Motivo do aviso!')
                .setRequired(false),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction: ChatInputCommandInteraction) {
       const { guild, user, options } = interaction;

       if (!guild) return;

       // Coleta de daddos
       const targetUser = options.getUser('target', true);
       const reason = options.getString('reason') ?? "Sem motivo definido";
       const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);

       if (!targetMember) {
        interaction.reply({ content: '❌ Usuário não encontrado no servidor!', flags: MessageFlags.Ephemeral });
        return;
       }

       if (targetUser.id === user.id) {
        interaction.reply({ content: '❌ Você não pode avisar a si mesmo', flags: MessageFlags.Ephemeral });
        return;
       }

       if (targetUser.bot) {
        interaction.reply({ content: '❌ Você não pode avisar um bot!', flags: MessageFlags.Ephemeral });
        return;
       }

       // Verifica se o alvo é cargo maior ou igual a moderador
       const executorMembers = interaction.member as GuildMember;
       if (targetMember.roles.highest.position >= executorMembers.roles.highest.position) {
        interaction.reply({ content: '❌ Você não pode dar aviso à alguém com cargo maior que o seu!', flags: MessageFlags.Ephemeral });
        return;
       }

       // Consulta de configuração:
       const guildRef = db.collection('guilds').doc(guild.id);
       const guildSnap = await guildRef.get();
       const config = guildSnap.data();

       // Verifica os módulos
       if (!config?.modules?.moderation?.enabled) {
        interaction.reply({ content: '⚠️ O módulo de moderação está desativado.', flags: MessageFlags.Ephemeral });
        return;
       };

        if (!config?.modules?.moderation?.warningSystem) {
            interaction.reply({ content: '⚠️ O módulo de warning está desativado.', flags: MessageFlags.Ephemeral });
            return;
        };

        // Operação no banco de dados
        // Estrutura: users/{userId}/warnings/{guildId} -> Permite saber quantos warners por servidor
        const warningRef = db.collection('users').doc(targetUser.id).collection('warnings').doc(guild.id);

        // Usando set com merge para garantir que o doc exista e incrementa!
        await warningRef.set({
            warningCount: FieldValue.increment(1),
            lastReason: reason,
            updatedAt: new Date()
        }, { merge: true });

        //
        const updatedSnap = await warningRef.get();
        const newCount = updatedSnap.data()?.count || 1;

        //EMBED: Warning
        const warningEmbed = new EmbedBuilder()
            .setTitle('⚠️ Usuário Advertido')
            .setColor('#FFAA00') // Laranja é comum para warns, Vermelho para ban
            .addFields(
                { name: '👤 Usuário', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                { name: '🛡️ Moderador', value: `${user.tag}`, inline: true },
                { name: '🔢 Total de Avisos', value: `${newCount}`, inline: true },
                { name: '📝 Motivo', value: reason }
            )
            .setTimestamp()
            .setThumbnail(targetUser.displayAvatarURL());

        // Verifica Canal de log
        const logChannelId = config?.modules?.moderation?.logChannelId;

        // Tenta enviar ao canal de log
        if (logChannelId) {
            const logChannel = guild.channels.cache.get(logChannelId) as TextChannel;
            if (logChannel) {
                await logChannel.send({ embeds: [warningEmbed] }).catch(() => null);
            };
        }

        // Resposta Final:
        await interaction.reply({
            content: `✅ Aviso aplicado com sucesso para **${targetUser.tag}**.`,
            embeds: [warningEmbed],
            flags: MessageFlags.Ephemeral
        });
    }
}

export default warningCommand;