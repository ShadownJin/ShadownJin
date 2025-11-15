// src/events/interactionCreate.js
module.exports = {
  name: 'interactionCreate',
  once: false,
  execute: async (client, interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: 'Comando não encontrado', ephemeral: true });

      // permissions / guildOnly
      if (cmd.meta.guildOnly && !interaction.guild) return interaction.reply({ content: 'Esse comando só pode ser usado em servidores.', ephemeral: true });

      // checks de permissões (interactions)
      if (cmd.meta.permissions && cmd.meta.permissions.length > 0) {
        const member = interaction.member;
        const missing = cmd.meta.permissions.filter(p => !member.permissions.has(p));
        if (missing.length) return interaction.reply({ content: 'Você não tem permissão para usar esse comando.', ephemeral: true });
      }

      // cooldown simples (pode usar o mesmo lib)
      const { hasCooldown } = require('../lib/cooldown');
      const cd = hasCooldown({ guildId: interaction.guild?.id, userId: interaction.user.id, command: cmd.name, seconds: cmd.meta.cooldown || 5 });
      if (!cd.ok) return interaction.reply({ content: `Aguarde ${cd.left}s para usar esse comando novamente.`, ephemeral: true });

      await cmd.execute(interaction, [], client);
    } catch (err) {
      console.error('interactionCreate handler error', err);
      if (interaction.replied || interaction.deferred) {
        try { await interaction.followUp({ content: 'Erro ao executar comando.', ephemeral: true }); } catch {}
      } else {
        try { await interaction.reply({ content: 'Erro ao executar comando.', ephemeral: true }); } catch {}
      }
    }
  }
};
