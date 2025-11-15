module.exports = {
  name: 'clientReady',
  once: true,
  execute: (client) => {
    console.log(`ShadownJin pronto como ${client.user.tag} — ${new Date().toLocaleString()}`);
  }
};
