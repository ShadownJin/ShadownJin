// src/handlers/eventHandler.ts

import fs from 'fs';
import path from 'path';
import { Client } from 'discord.js';
// Importamos a interface IEvent que definimos no arquivo de tipos
import { IEvent } from '../structs/types/client.js'; 
import { fileURLToPath } from 'url'; // Necessário para definir __dirname
import { URL } from 'url';

// --- Definição de __dirname para funções auxiliares (se necessário) ---
// Se este handler for carregado dinamicamente, você pode precisar disto:
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// -------------------------------------------------------------------


/**
 * @param client O cliente Discord.
 * @param currentPath O caminho atual para a pasta de eventos.
 */
async function loadFilesAndRegisterEvents(client: Client, currentPath: string): Promise<void> {
    
    // Filtramos por arquivos que o tsx vai transpilar e carregar (geralmente .ts)
    const files = fs.readdirSync(currentPath).filter(f => f.endsWith('.ts')); 
    
    for (const file of files) {
        const full = path.join(currentPath, file);
        
        try {
            // A cache de módulos em ESM é gerenciada de forma diferente e esta linha é removida
            // delete require.cache[require.resolve(full)]; 
            
            // CONVERSÃO CRÍTICA: Substituir require por await import() dinâmico
            // Usamos new URL() para garantir que caminhos do sistema de arquivos funcionam com import
            const eventModule = await import(new URL(`file://${full}`).toString());
            
            // Em ESM, a exportação é sempre o 'default'.
            const event: IEvent = eventModule.default; 
            
            if (!event || !event.name || typeof event.execute !== 'function') {
                console.warn(`[EVENTO INVÁLIDO] Evento pulado: ${file}`);
                continue;
            }
            
            // Registo do listener
            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }
            
        } catch (err) {
            console.error(`[EVENTO ERRO] Erro ao carregar evento em ${full}:`, err);
        }
    }
    
    // Lógica recursiva para subdiretórios
    const subdirs = fs.readdirSync(currentPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
        
    for (const dir of subdirs) {
        const dirPath = path.join(currentPath, dir);
        // Chamada recursiva assíncrona
        await loadFilesAndRegisterEvents(client, dirPath);
    }
}

/**
 * Carrega todos os eventos.
 * @param client O cliente Discord.
 * @param eventsPath O caminho raiz da pasta de eventos.
 */
export async function loadEvents(client: Client, eventsPath: string): Promise<void> {
    // Certifique-se de que eventsPath não é mais baseado em __dirname (que você não define aqui)
    // Se você estiver a passar o path correto do index.ts, o código funciona.
    await loadFilesAndRegisterEvents(client, eventsPath);
}