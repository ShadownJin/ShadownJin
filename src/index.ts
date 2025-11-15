import { config } from 'dotenv';
config();
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits, } from 'discord.js';
import { addXp, canGain, xpToLevel } from './lib/xpManager.js';
import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


client.commands = new Collection();
await loadCommands(client, path.join(__dirname, 'commands'));
await loadEvents(client, path.join(__dirname, 'events'));

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection: ', reason, p);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

client.login(process.env.DISCORD_TOKEN)
.then(() => console.log('Bot ligado....'))
.catch(err => {
    console.error('Erro ao logar o bot: ', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Recebido SIGINT — encerrando cliente Discord...');
    try { await client.destroy(); } catch (e) { /* ignore */ }
    process.exit(0);
})