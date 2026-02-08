// Imports
import dotenv from 'dotenv';
dotenv.config();
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { initFirestore } from './lib/database/firestore.js';

//Handlers
import { loadCommands } from './handlers/commandHandler.js';
import { CustomClient } from './structs/types/client.js';
import { loadEvents } from './handlers/eventHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ // Cria o client
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
}) as CustomClient;

(async () => {
    client.commands = new Collection();
    await loadCommands(client, path.join(__dirname, 'commands'));
    await loadEvents(client, path.join(__dirname, 'events'));

    client.cooldown = new Collection();

    // Inicia o banco de dados!
    initFirestore();

    client.login(process.env.BOT_TOKEN)
        .then(() => console.log('😴Bot ligando...'))
        .catch(err => {
            console.error('Erro ao ligar o bot: ', err);
            process.exit(1);
        });

    process.on('SIGINT', async () => {
        console.log('💤Bot desligando...');
        await client.destroy();
        process.exit(0);
    });
})();