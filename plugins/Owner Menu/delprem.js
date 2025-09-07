import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['delprem', 'removepremium'],
  tag: 'owner',
  description: 'Menghapus pengguna dari daftar premium.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, text, mentioned, args, system }) {
    let targetId = null;

    if (mentioned > 0) {
      targetId = mentioned[0];
    } else if (args[0] && args[0].match(/\d+/)) {
      targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }

    if (!targetId) {
      return criv.sendMessage(m.chat, { text: `🚩 Penggunaan salah. Tag pengguna atau berikan nomornya. Contoh: *.delprem @${m.sender.split('@')[0]}* atau *.delprem 62812xxxxxx*` }, { quoted: m });
    }

    const decodedTargetId = decodeJid(targetId);
    
    system.addUser(decodedTargetId);

    if (!system.isPremium(decodedTargetId)) {
      return criv.sendMessage(m.chat, { text: `⚠️ Pengguna ${decodedTargetId.split('@')[0]} bukan premium.` }, { quoted: m });
    }

    await system.setPremium(decodedTargetId, false);
    return criv.sendMessage(m.chat, { text: `✅ Berhasil menghapus ${decodedTargetId.split('@')[0]} dari daftar premium.` }, { quoted: m, mentions: [decodedTargetId] });
  }
};
