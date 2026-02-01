// Imports
import dotenv from 'dotenv';
dotenv.config();
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.login(process.env.BOT_TOKEN)
    .then(() => console.log('Bot ligando...'))
    .catch(err => {
        console.error('Erro ao ligar o bot: ', err);
        process.exit(1);
    });

process.on('SIGINT', async () => {
    console.log('Bot desligando...');
    await client.destroy();
    process.exit(0);
})