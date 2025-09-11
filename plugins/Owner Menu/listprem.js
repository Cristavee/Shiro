import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['listprem', 'premiums'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, system, db }) {
    try {
      const allUsers = system.getAllUsers();
      const premiumUsers = Object.keys(allUsers).filter(id => system.isPremium(id));

      if (premiumUsers.length === 0) {
        return criv.sendMessage(
          m.chat,
          { text: 'Tidak ada pengguna premium yang terdaftar.' },
          { quoted: m }
        );
      }

      let message = '*Daftar Pengguna Premium:*\n\n';
      let mentions = [];

      premiumUsers.forEach((userJid, index) => {
        const decodedJid = decodeJid(userJid);
        const userNum = decodedJid.split('@')[0];
        const name = db.data?.users?.[decodedJid]?.name || 'Unknown';
        message += `${index + 1}. *${name}* - ${userNum}\n`;
        mentions.push(decodedJid);
      });

      return criv.sendMessage(
        m.chat,
        { text: message, mentions },
        { quoted: m }
      );
    } catch (err) {
      console.error('Error listprem:', err);
      return criv.sendMessage(
        m.chat,
        { text: `❌ Terjadi kesalahan: ${err.message}` },
        { quoted: m }
      );
    }
  }
};