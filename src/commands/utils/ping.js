const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!'),

  async execute(interaction, args, client) {
    await interaction.reply('Pong!');
  }
};
