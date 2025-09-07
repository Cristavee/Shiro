import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['listowner', 'listown'],
  tag: 'owner',
  description: 'Melihat daftar owner bot.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, system}) {
    const ownerList = system.getOwnerList();
    if (ownerList.length === 0) {
      return criv.sendMessage(m.chat, { text: 'Tidak ada owner yang terdaftar di database.' }, { quoted: m });
    }

    let message = '*Daftar Owner Bot:*\n\n';
    let mentions = [];
    ownerList.forEach((ownerJid, index) => {
      const ownerNum = ownerJid.split('@')[0];
      message += `${index + 1}. @${ownerNum}\n`;
      mentions.push(ownerJid);
    });

    return criv.sendMessage(m.chat, { text: message, mentions: mentions }, { quoted: m });
  }
};