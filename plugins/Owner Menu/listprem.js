import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['listprem', 'premiums'],
  tag: 'owner',
  description: 'Melihat daftar pengguna premium.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, system}) {
    const allUsers = system.getAllUsers();
    const premiumUsers = Object.keys(allUsers).filter(id => system.isPremium(id));

    if (premiumUsers.length === 0) {
      return criv.sendMessage(m.chat, { text: 'Tidak ada pengguna premium yang terdaftar.' }, { quoted: m });
    }

    let message = '*Daftar Pengguna Premium:*\n\n';
    let mentions = [];
    premiumUsers.forEach((userJid, index) => {
      const userNum = userJid.split('@')[0];
      const name = m.db.users[userNum].name
      message += `${index + 1}. *${name}* - ${userNum}\n`;
      mentions.push(userJid);
    });

    return criv.sendMessage(m.chat, { text: message, mentions: mentions }, { quoted: m });
  }
};