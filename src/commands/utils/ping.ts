import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../../structs/types/client.js';

const pingCommand: Command = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('[UTILS] Responde com pong!'),
    async execute(interaction: any) {
        await interaction.reply('Pong!');
    }
};

export default pingCommand;