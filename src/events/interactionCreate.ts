import {
    Client,
    Interaction,
    ChatInputCommandInteraction,
    PermissionResolvable
} from 'discord.js';

import { hasCooldown } from '../lib/cooldown.js';
import { CooldownResult } from '../structs/types/client.js';

// 2. Importação das Interfaces globais (IEvent e ICommand)
import { IEvent, ICommand } from '../structs/types/client.js'; // Ajuste o caminho conforme o seu projeto

/**
 * Evento 'interactionCreate'
 * Lida com todas as interações do Discord, focando primariamente em comandos de barra.
 */
const interactionCreateEvent: IEvent = {
    name: 'interactionCreate',
    once: false,

    /**
     * @param client O objeto cliente do Discord.
     * @param interaction A interação disparada.
     */
    execute: async (client: Client, interaction: Interaction): Promise<void> => {
        try {
            // 1. Filtrar para Comandos de Barra (Slash Commands)
            if (!interaction.isChatInputCommand()) return;

            // Tipamos a interação específica para ter acesso a propriedades de comandos
            const chatCommandInteraction = interaction as ChatInputCommandInteraction;

            // 2. Encontrar o Comando
            // O acesso a client.commands é seguro devido à extensão da interface Client
            const cmd: ICommand | undefined = client.commands.get(chatCommandInteraction.commandName);
            
            if (!cmd) {
                await interaction.reply({ content: 'Comando não encontrado.', ephemeral: true });
                return;
            }

            // 3. Verificação: guildOnly
            if (cmd.meta.guildOnly && !interaction.guild) {
                await interaction.reply({ content: 'Esse comando só pode ser usado em servidores.', ephemeral: true });
                return;
            }

            // 4. Verificação: permissions
            // Note que interaction.member pode ser um APIInteractionGuildMember ou GuildMember.
            if (cmd.meta.permissions && cmd.meta.permissions.length > 0) {
                const member = interaction.member;
                if (!member) return;
                const memberPermissions = member.permissions;

            if (typeof memberPermissions === 'string') {
                await interaction.reply({
                    content: 'Não foi possível verificar as permissões do membro.', ephemeral: true
                });
                return;
            }
                
                // Tipagem do array de permissões em falta
                const missing: PermissionResolvable[] = cmd.meta.permissions.filter(
                        (p: PermissionResolvable) => !memberPermissions.has(p)
                );
                
                if (missing.length) {
                    await interaction.reply({ content: 'Você não tem permissão para usar esse comando.', ephemeral: true });
                    return;
                }
            }

            // 5. Verificação: Cooldown
            const cd: CooldownResult = hasCooldown({ 
                guildId: interaction.guildId!,
                userId: interaction.user.id, 
                command: cmd.name, 
                seconds: cmd.meta.cooldown || 3 
            });
            
            if (!cd.ok) {
                await interaction.reply({ content: `Aguarde ${cd.left}s para usar esse comando novamente.`, ephemeral: true });
                return;
            }

            // 6. Execução do Comando
            try {
                // Seu padrão é cmd.execute(interaction, [], client)
                // O ICommand que definimos anteriormente espera (client, message, args). 
                // Você pode precisar ajustar a chamada ou a interface ICommand.
                
                // Se o seu execute espera (interaction, args, client), ajuste a chamada:
                await cmd.execute(client, interaction as any, []);
                
            } catch (err) {
                console.error(`[INTERACTION ERRO] Erro ao executar o comando ${cmd.name}:`, err);
                // Tratamento de erro robusto
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Erro ao executar comando.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Erro ao executar comando.', ephemeral: true });
                }
            }
        } catch (err) {
            console.error('[HANDLER ERRO] Erro no interactionCreate handler:', err);
        }
    }
};

export default interactionCreateEvent;