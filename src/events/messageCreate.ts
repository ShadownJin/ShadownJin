import { 
    Message, 
    Client, 
    // Removidas importações não usadas: PermissionResolvable, CooldownResult
} from 'discord.js';
// Removidas importações não usadas: hasCooldown
// import { CooldownResult } from '../structs/types/client.js'; 
import { addXp, canGain } from '../lib/xpManager.js';

// 2. Importação das Interfaces globais (IEvent)
import { IEvent } from '../structs/types/client.js'; // ICommand não é mais necessário aqui

/**
 * Evento 'messageCreate'
 * Dispara quando uma mensagem é criada. Contém APENAS a lógica de ganho de XP.
 */
const messageCreateEvent: IEvent = {
    name: 'messageCreate', 
    once: false,
    
    execute: async (client: Client, message: Message): Promise<void> => {
        try {
            // Se o autor for um bot ou não estiver num servidor, ignora.
            if (message.author.bot || !message.guild) return;
            if (!message.member) return

            // --- Lógica de Comandos Prefixados REMOVIDA ---
            // Nenhuma variável PREFIX ou lógica de parsing de comando.

            // --- Lógica de Ganho de XP ---
            // Certificamos que as funções de XP existem antes de chamar
            if (canGain && addXp && canGain(message.author.id)) {
                // Ganha XP aleatoriamente entre 5 e 10
                const xpGain: number = Math.floor(Math.random() * 6) + 5; 
                try { 
                    await addXp(message.guild.id, message.author.id, xpGain); 
                } catch (err) { 
                    console.error('[XP ERRO]', err); 
                }
            }
            
        } catch (err) {
            console.error('[HANDLER ERRO] Erro no messageCreate handler:', err);
        }
    }
};

export default messageCreateEvent;