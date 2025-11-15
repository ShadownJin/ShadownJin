module.exports = {
  name: 'ping',
  description: 'Ping',
  execute: async (message, args) => {
    return message.reply('Pong!');
  }
};
