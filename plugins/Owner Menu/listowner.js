import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['listowner', 'listown'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, system }) {
    try {
      const ownerList = system.getOwnerList();

      if (!ownerList || ownerList.length === 0) {
        return criv.sendMessage(
          m.chat,
          { text: 'Tidak ada owner yang terdaftar di database.' },
          { quoted: m }
        );
      }

      let message = '*Daftar Owner Bot:*\n\n';
      let mentions = [];

      ownerList.forEach((ownerJid, index) => {
        const decodedJid = decodeJid(ownerJid);
        const ownerNum = decodedJid.split('@')[0];
        message += `${index + 1}. @${ownerNum}\n`;
        mentions.push(decodedJid);
      });

      return criv.sendMessage(
        m.chat,
        { text: message, mentions },
        { quoted: m }
      );
    } catch (err) {
      console.error('Error listowner:', err);
      return criv.sendMessage(
        m.chat,
        { text: `❌ Terjadi kesalahan: ${err.message}` },
        { quoted: m }
      );
    }
  }
};