require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { addXp, canGain } = require('./lib/xpManager');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.name, cmd);
}

const PREFIX = process.env.BOT_PREFIX || '!';

client.once('ready', () => {
  console.log(`ShadownJin pronto: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  // comandos
  if (message.content.startsWith(PREFIX)) {
    const [cmdName, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd = client.commands.get(cmdName);
    if (!cmd) return;
    try { await cmd.execute(message, args); } catch (err) { console.error(err); message.reply('Erro ao executar comando'); }
    return;
  }

  // XP
  if (!canGain(message.author.id)) return;
  const xpGain = Math.floor(Math.random() * 6) + 5; // 5-10
  try { await addXp(message.guild.id, message.author.id, xpGain); } catch (err) { console.error('xp error', err); }
});

client.login(process.env.DISCORD_TOKEN);
