import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
/**
 * @param client
 * @param eventsPath
 * @return
 */
export async function loadEvents(client, eventsPath) {
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const imported = await import(pathToFileURL(filePath).href);
        const event = imported.default ?? Object.values(imported).find((v) => v && typeof v === 'object' && 'name' in v && 'execute' in v);
        if (!event) {
            console.log(`[AVISO!] Evento ${filePath} não exporta um objeto de evento válido.`);
            continue;
        }
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        }
        else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
}
