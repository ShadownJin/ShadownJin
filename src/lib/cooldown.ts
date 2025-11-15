import { CooldownParams, CooldownResult } from '../structs/types/client.js';

/**
 * O mapa armazena o estado do ativo dos cooldowns
 * Chave: string (Ex: '12345_67890_ping)
 * Valor: number (Timestamp do momento que o cooldown expira)
 */
const active = new Map<string, number>();

// --- Função de Verificação e aplicação de Cooldown
/**
 * 
 * @param params 
 * @param seconds
 * @returns 
 */

export function hasCooldown(
    params: CooldownParams & { seconds: number }
): CooldownResult {
    const { guildId, userId, command, seconds } = params;

    // Constrói a chave: 'guildId' ou 'dm' + 'userId' + 'command'
    const key = `${guildId || 'dm'}_${userId}_${command}`;
    const now = Date.now();

    // Obtém o timestamp de expiração (se existir, caso contrário 0)
    const expires = active.get(key) || 0; 

    // Se o tempo atual for MENOR que o tempo de expiração, o cooldown está ativo
    if (now < expires) {
    // Calcula o tempo restante em segundos (arredondado para cima)
    const left = Math.ceil((expires - now) / 1000);
    return { ok: false, left };
    }

    active.set(key, now + (seconds * 1000));
    return { ok: true };
}

export function clearCooldown(params: CooldownParams): void {
    const { guildId, userId, command } = params;
    const key = `${guildId || 'dm'}_${userId}_${command}`;

    active.delete(key)
}
