import { 
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    MessageFlags,
    EmbedBuilder,
    TextChannel
} from "discord.js";
import { Command } from "../../structs/types/client.js";
import { initFirestore } from "../../lib/firestore.js";
import { getOrCreateWarningUser } from "../../lib/database/defaultUser.schema.js";
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
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? "Nenhuma motivo fornecido";
        const { guild } = interaction;
        const userId = target!.id;
        const guildId = guild!.id;

        const guildDoc = await db.collection('guilds').doc(String(guildId)).get();
        const config = guildDoc.data();
        const moderationSystem = config?.modules?.moderation?.enabled;
        const warningSystem = config?.modules?.moderation?.warningSystem;
        const logChannelId = config?.modules?.moderation?.logChannelId;

        if (moderationSystem === false) { // Verifica se modulo de moderação estão ativados
            await interaction.reply({
                content: 'O modulo de moderação do servidor está desligado, favor solicitar alguém com permissão para ligar o modulo para usar o comando!',
                flags: MessageFlags.Ephemeral
            });
            return;
        } else if ( warningSystem === false) { // Verifica se modulo de aviso está ligado
            await interaction.reply({
                content: 'O modulo de aviso está desligado! Favor solicitar para alguém com permissão para ligar o modulo para usar o comando!',
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        // Sistemas todos ligados
        const warningData = await getOrCreateWarningUser(String(userId), String(guildId));
        const currentWarning = warningData.warningCount ?? 0;
        const newWarningCount = currentWarning + 1;

        if (!guild || !target) return;
        const member = await guild.members.fetch(target.id);

        // VERIFICAÇÃO: Usuário é cargo maior!
        if (!member.bannable && !member.kickable) {
            interaction.reply({
                content: "❌ Eu não posso adicionar um aviso a esse membro!\n Ele pode ser cargo superior!",
                flags: MessageFlags.Ephemeral
            });
            return;
        };

        const userRef = await db.collection('users').doc(String(target.id)).collection('warning').doc(String(guild.id));
        const snap = await userRef.get();

        //EMEBED: Warning User!
        const warningEmbed = new EmbedBuilder()
            .setTitle('⚠️ Usuário Notificado!')
            .setColor('#FF0000')
            .addFields(
                {
                    name: 'Usuario',
                    value: `${target.tag} ID: ${target.id}`,
                    inline: true
                },
                {
                    name: 'Moderador',
                    value: `${interaction.user.tag} ID: ${interaction.user.id}`,
                    inline: true
                },
                {
                    name: 'Qtd Aviso',
                    value: `${newWarningCount}`,
                    inline: true
                },
                {
                    name: 'Razão',
                    value: reason
                },)
            .setTimestamp();

        // VERIFICAÇÃO: Usuário nunca sofreu aviso!
        if (!snap.exists) {
            await userRef.set({
                warningCount: 1,
                updateAt: new Date()
            });
            // Verifica se possui o canal e envia o log e retorna
            if (logChannelId) {
                const logChannel = guild.channels.cache.get(logChannelId) as TextChannel;
                await logChannel.send({ embeds: [warningEmbed] })
                return;
            };
        };

        // Faz o update do aviso do usuário
        await userRef.update({
            warningCount: newWarningCount
        });

        // Verifica se possui o canal de log
        if (logChannelId) {
            const logChannel = guild.channels.cache.get(logChannelId) as TextChannel;
            await logChannel.send({ embeds: [warningEmbed] })
            await interaction.reply()
        } else {
            // Sem canal de log responde no proprio chat!
            await interaction.reply({
                embeds: [warningEmbed],
                flags: MessageFlags.Ephemeral
            });
        };
    }
}

export default warningCommand;