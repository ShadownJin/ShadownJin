import { Client, CommandInteraction, ApplicationCommandType, MessageFlags } from 'discord.js';
import { ICommand } from '../../structs/types/client.js'; // Ajuste o caminho conforme o seu projeto

/**
 * Comando 'ping'
 * Um comando simples de teste para verificar a conectividade e a funcionalidade básica do bot.
 */
const pingCommand: ICommand = {
    name: 'ping',
    description: '[UTILS] Verifica se o bot está online e a responder.',
    category: 'Utils',
    // A estrutura dos comandos de barra é definida no 'meta'
    meta: {
        type: ApplicationCommandType.ChatInput, // Indica que é um comando de barra (Slash Command)
        guildOnly: false, // Pode ser usado em DMs
        permissions: [], // Nenhuma permissão especial necessária
        cooldown: 3 // Cooldown de 3 segundos
    },

    // A função de execução, seguindo o seu padrão ICommand: execute(client, interaction, args)
    execute: async (client: Client, interaction: CommandInteraction): Promise<void> => {
        // O interaction.reply() é essencial para comandos de barra.
        try {
            await interaction.reply({ 
                content: 'Estou online!',
                flags: MessageFlags.Ephemeral // Apenas o usuário que invocou vê a resposta
            });
        } catch (error) {
            console.error('Erro ao responder ao comando ping:', error);
            // Em caso de falha na resposta inicial, tentamos followUp
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ 
                    content: 'Erro ao processar o comando.', 
                    ephemeral: true 
                });
            } else {
                await interaction.reply({ 
                    content: 'Erro ao processar o comando.', 
                    ephemeral: true 
                });
            }
        }
    }
};

export default pingCommand;