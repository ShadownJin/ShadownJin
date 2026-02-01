import type { CustomClient, Event } from '../structs/types/client.js';

const interactionCreate: Event = {
  name: 'interactionCreate',
  async execute(client: CustomClient, interaction: any) {
    try {
      if (!interaction || !interaction.isChatInputCommand || !interaction.isChatInputCommand()) return;

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        await interaction.reply({ content: 'Comando não encontrado.', ephemeral: true });
        return;
      }

      await command.execute(interaction);
    } catch (err) {
      console.error('Erro ao processar interação:', err);
      try {
        if (interaction && !interaction.replied) await interaction.reply({ content: 'Erro ao executar o comando.', ephemeral: true });
      } catch { }
    }
  }
};

export default interactionCreate;
