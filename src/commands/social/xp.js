const { xpToLevel } = require('../../lib/xpManager');
const { initFirestore } = require('../../lib/firestore');

module.exports = {
  name: 'xp',
  description: 'Ver XP e nível',
  execute: async (message) => {
    const db = initFirestore();
    const id = `${message.guild.id}_${message.author.id}`;
    const snap = await db.collection('users').doc(id).get();
    const data = snap.exists ? snap.data() : { xp: 0 };
    return message.reply(`Você tem ${data.xp || 0} XP — nível ${xpToLevel(data.xp || 0)}`);
  }
};
