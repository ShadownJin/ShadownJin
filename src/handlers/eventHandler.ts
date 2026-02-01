import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import type { CustomClient, Event } from "../structs/types/client.js";

/**
 * @param client
 * @param eventsPath
 * @return
 */

export async function loadEvents(client: CustomClient, eventsPath: string) {
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const imported = await import(pathToFileURL(filePath).href);
        const event: Event | undefined = imported.default ?? Object.values(imported).find((v: any) => v && typeof v === 'object' && 'name' in v && 'execute' in v);
        if (!event) {
            console.log(`[AVISO!] Evento ${filePath} não exporta um objeto de evento válido.`);
            continue;
        }

        if ((event as any).once) {
            client.once(event.name, (...args: any[]) => (event.execute as any)(client, ...args));
        } else {
            client.on(event.name, (...args: any[]) => (event.execute as any)(client, ...args));
        }
    }
}