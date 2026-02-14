import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';
import type { Command } from './structs/types/client.js';

const token = process.env.BOT_TOKEN;
const clientId = process.env.BOT_APPLICATION_ID;
const guildId = process.env.GUILD_TESTE_ID; // optional: if present deploys to a guild

(async () => {

  if (!token || !clientId) {
    console.error('Faltando variáveis de ambiente: verifique BOT_TOKEN e CLIENT_ID');
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commands: any[] = [];
  const commandsPath = path.join(process.cwd(), 'src', 'commands');
  if (!fs.existsSync(commandsPath)) {
    console.error(`Pasta de comandos não encontrada: ${commandsPath}`);
    process.exit(1);
  }

  const commandFolders = fs.readdirSync(commandsPath);
  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(folderPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const imported = await import(pathToFileURL(filePath).href);
      const cmd: Command = imported.default ?? imported;
      if (cmd && 'data' in cmd) {
        // SlashCommandBuilder -> toJSON, plain object -> as is
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const json = (typeof (cmd as any).data?.toJSON === 'function') ? (cmd as any).data.toJSON() : (cmd as any).data; 
        commands.push(json);

      } else {
        console.log(`[AVISO] arquivo de comando inválido: ${filePath}`);
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log(`Iniciando deploy de ${commands.length} comando(s)...`);
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('Comandos registrados no guildo com sucesso.');
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Comandos registrados globalmente com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao registrar comandos:', err);
    process.exit(1);
  }
})();
