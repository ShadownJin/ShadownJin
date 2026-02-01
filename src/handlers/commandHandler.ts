import fs from "fs";
import path from "path";
import { pathToFileURL } from 'url';
import { Collection } from "discord.js";
import type { Command, CustomClient } from "../structs/types/client.js";

/**
 * @param client
 * @param commandsPath
 * @return
 */

export async function loadCommands(client: CustomClient, commandsPath: string) {
    client.commands = new Collection();
    const foldersPath = commandsPath; // path passed from caller (no __dirname reliance)
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const imported = await import(pathToFileURL(filePath).href);
            const command = (imported.default ?? imported) as Command;
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[AVISO!] O comando ${filePath} está faltando uma das propriedades requeridas: "data" ou "execute"`);
            }
        }
    }
}