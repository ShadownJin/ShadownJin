import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";
dotenv.config();

import { ICommand } from "./structs/types/client.js";

// ESM fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista final de slash commands
const commands: any[] = [];

function readCommandsRecursively(dir: string): string[] {
    const entries = readdirSync(dir);
    const results: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stats = statSync(fullPath);

        if (stats.isDirectory()) {
            results.push(...readCommandsRecursively(fullPath));
        } else if (stats.isFile() && (entry.endsWith(".ts") || entry.endsWith(".js"))) {
            results.push(fullPath);
        }
    }

    return results;
}

async function loadCommands() {
    const commandsPath = path.join(__dirname, "commands");
    const files = readCommandsRecursively(commandsPath);

    for (const filePath of files) {
        // Convertendo para file:/// URL → AGORA FUNCIONA
        const fileUrl = pathToFileURL(filePath).href;

        const module = await import(fileUrl);
        const command: ICommand = module.default;

        if (!command || !command.name || !command.description) {
            console.warn(`⚠️ Comando inválido ignorado: ${filePath}`);
            continue;
        }

        const slash = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

        commands.push(slash.toJSON());
    }
}

async function deploy() {
    await loadCommands();

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string);

    try {
        console.log("🚀 Deploy de slash commands iniciado...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.APPLICATION_ID!,
                process.env.GUILD_ID!
            ),
            { body: commands }
        );

        console.log("✅ Deploy concluído com sucesso!");
    } catch (error) {
        console.error("❌ Erro no deploy:", error);
    }
}

deploy();
