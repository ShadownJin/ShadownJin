require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const { addXp, canGain, xpToLevel } = require('./lib/xpManager');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ]
});

// Carrega comandos e eventos
loadCommands(client, path.join(__dirname, 'commands'));
loadEvents(client, path.join(__dirname, 'events'));

// tratamento básico de erros não capturados (útil em dev)
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection:', reason, p);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


client.login(process.env.DISCORD_TOKEN)
.then(() => console.log('Tentando logar o bot...'))
.catch(err => {
  console.error('Erro ao logar o bot:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Recebido SIGINT — encerrando cliente Discord...');
  try { await client.destroy(); } catch (e) { /* ignore */ }
  process.exit(0);
});