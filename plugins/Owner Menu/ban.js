import { decodeJid } from '../../lib/helpers.js';
  export default {
  command: ['ban'],
  tag: 'owner',
owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,
    async run(criv, { m, text, mentioned, args, system}) {
    let targetId = null;
      if (mentioned > 0) {
      targetId = mentioned[0];
    } else if (args[0] && args[0].match(/\d+/)) {
      targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }
      if (!targetId) {
      return criv.sendMessage(m.chat, { text: msg.reply }, { quoted: m });
    }
      const decodedTargetId = decodeJid(targetId);
      if (system.isOwner(decodedTargetId)) {
        return criv.sendMessage(m.chat, { text: `> Tidak bisa memblokir owner bot.` }, { quoted: m });
    }
    
    system.addUser(decodedTargetId);
      if (system.isUserBanned(decodedTargetId)) {
      return criv.sendMessage(m.chat, { text: `> Pengguna ${decodedTargetId.split('@')[0]} sudah diblokir.` }, { quoted: m });
    }
      await system.banUser(decodedTargetId);
    return criv.sendMessage(m.chat, { text: `> Berhasil memblokir ${decodedTargetId.split('@')[0]} dari penggunaan bot.` }, { quoted: m, mentions: [decodedTargetId] });
  }
};