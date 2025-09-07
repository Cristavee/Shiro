import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['addowner', 'addown'],
  tag: 'owner',
  description: 'Menambahkan pengguna sebagai owner bot.',
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
      return criv.sendMessage(m.chat, { text: `🚩 Penggunaan salah. Tag pengguna atau berikan nomornya. Contoh: *.addowner @${m.sender.split('@')[0]}* atau *.addowner 62812xxxxxx*` }, { quoted: m });
    }

    const decodedTargetId = decodeJid(targetId);

    if (system.isOwner(decodedTargetId)) {
      return criv.sendMessage(m.chat, { text: `⚠️ Pengguna ${decodedTargetId.split('@')[0]} sudah menjadi owner.` }, { quoted: m });
    }

    await system.addOwner(decodedTargetId);
    return criv.sendMessage(m.chat, { text: `Berhasil menambahkan ${decodedTargetId.split('@')[0]} sebagai owner baru.` }, { quoted: m, mentions: [decodedTargetId] });
  }
};
