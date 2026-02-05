import { SlashCommandBuilder } from 'discord.js';
const pingCommand = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('[UTILS] Responde com pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    }
};
export default pingCommand;
