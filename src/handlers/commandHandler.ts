import fs from 'fs';
import path from 'path';
import { Client, Collection } from 'discord.js';
import { ICommand } from '../structs/types/client.js'; // Use .js para ESM

// Função de leitura de arquivos (sem alterações necessárias, pois só usa fs/path)
function readFilesRecursively(folder: string): string[] {
    const entries = fs.readdirSync(folder, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const full = path.join(folder, entry.name);

        if (entry.isDirectory()) {
            files.push(...readFilesRecursively(full));
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
            files.push(full);
        }
    }
    return files;
}


/**
 * Carrega e regista todos os comandos encontrados no caminho.
 * @param client O cliente Discord.
 * @param commandsPath O caminho absoluto para a pasta de comandos.
 * @returns A coleção de comandos do cliente.
 */
export async function loadCommands(client: Client, commandsPath: string): Promise<Collection<string, ICommand>> {
    const files = readFilesRecursively(commandsPath);

    for (const full of files) {
        // Em ESM (como tsx), não há cache para comandos como em CJS.
        // Portanto, a lógica de 'delete require.cache' é removida.
        
        try {
            // CONVERSÃO CRÍTICA: Substituir 'require' por 'await import()'
            // Usamos 'file:///' para que o caminho do sistema de arquivos funcione no import dinâmico.
            const commandModule = await import(`file:///${full}`);
            
            // Em ESM, a exportação é sempre o 'default'.
            const cmd: ICommand = commandModule.default;

            // Validação de comandos (ajustada para a sua estrutura ICommand)
            if (!cmd || !cmd.meta || !cmd.name || typeof cmd.execute !== 'function') {
                console.warn(`Comando inválido pulado: ${full}`);
                continue;
            }

            // Atribui metadados (se necessário) e adiciona à coleção
            // Esta linha pode ser simplificada se o ICommand for obrigatório no arquivo
            // cmd.meta = Object.assign({ cooldown: 3, permissions: [], guildOnly: false}, cmd.meta || {});
            
            client.commands.set(cmd.name, cmd);

            cmd._filePath = full;
        } catch (err) {
            console.error('Erro ao carregar comando', full, err);
        }
    }
    return client.commands;
}