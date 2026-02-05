/**
 * Chave: string (ex: 12345_69890_ping)
 * Valor: number (timestamp do momento que o cooldown expire)
 */
const active = new Map();
/**
 * @param params - Objeto contendo configurações do cooldown
 * @param seconds - Número de segundos paara aguardar
 * @returns Uma promise que resolve após o tempo especificado.
 */
export function hasCooldown(params) {
    const { guildId, userId, command, seconds } = params;
    // Contrução da chave
    const key = `${guildId || 'dm'}_${userId}_${command}`;
    const now = Date.now();
    // Obtém o timestamp de expiração caso contrario é 0
    const expires = active.get(key) || 0;
    // Se o tempo atual for MENOR que o tempo de expiração o cooldown está ativo;
    if (now < expires) {
        const left = Math.ceil((expires - now) / 1000);
        return { ok: false, left };
    }
    active.set(key, now + (seconds * 1000));
    return { ok: true };
}
export function clearCooldown(params) {
    const { guildId, userId, command } = params;
    const key = `${guildId || 'dm'}_${userId}_${command}`;
    active.delete(key);
}
