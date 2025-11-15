// src/events/messageCreate.js
const { hasCooldown } = require('../lib/cooldown');
const path = require('path');

// xpManager fica independente, caso já exista no seu projeto
const { addXp, canGain } = require('../lib/xpManager');

module.exports = {
  name: 'messageCreate',
  once: false,
  execute: async (client, message) => {
    try {
      if (message.author.bot || !message.guild) return;

      const PREFIX = process.env.BOT_PREFIX || '!';

      // comandos prefixados
      if (message.content.startsWith(PREFIX)) {
        const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
        const cmdName = args.shift().toLowerCase();
        const cmd = client.commands.get(cmdName);
        if (!cmd) return;

        // guildOnly
        if (cmd.meta.guildOnly && !message.guild) return message.reply('Esse comando só pode ser usado em servidores.');

        // permissions
        if (cmd.meta.permissions && cmd.meta.permissions.length > 0) {
          const missing = cmd.meta.permissions.filter(p => !message.member.permissions.has(p));
          if (missing.length) return message.reply('Você não tem permissão para usar esse comando.');
        }

        // cooldown
        const cd = hasCooldown({ guildId: message.guild.id, userId: message.author.id, command: cmd.name, seconds: cmd.meta.cooldown || 5 });
        if (!cd.ok) return message.reply(`Aguarde ${cd.left}s para usar esse comando novamente.`);

        try {
          await cmd.execute(message, args, client);
        } catch (err) {
          console.error('Erro comando', cmd.name, err);
          message.reply('Erro ao executar o comando.');
        }
        return;
      }

      // XP por mensagem (mantivemos sua lógica)
      if (canGain && canGain(message.author.id)) {
        const xpGain = Math.floor(Math.random() * 6) + 5;
        try { await addXp(message.guild.id, message.author.id, xpGain); } catch (err) { console.error('xp error', err); }
      }
    } catch (err) {
      console.error('messageCreate handler error', err);
    }
  }
};
