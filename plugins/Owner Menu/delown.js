import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['delowner', 'delown'],
  tag: 'owner',
  description: 'Menghapus pengguna dari daftar owner bot.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, text, mentioned, args, system }) {
    let targetId = null;
      
    if (mentioned === global.bot?.owner) return m.reply('! Tidak dapat menghapus owner utama')
      
    if (mentioned > 0) {
      targetId = mentioned[0];
    } else if (args[0] && args[0].match(/\d+/)) {
      targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }

    if (!targetId) {
      return criv.sendMessage(m.chat, { text: `🚩 Penggunaan salah. Tag pengguna atau berikan nomornya. Contoh: *.delowner @${m.sender.split('@')[0]}* atau *.delowner 62812xxxxxx*` }, { quoted: m });
    }

    const decodedTargetId = decodeJid(targetId);

    if (!system.isOwner(decodedTargetId)) {
      return criv.sendMessage(m.chat, { text: `⚠️ Pengguna ${decodedTargetId.split('@')[0]} bukan owner.` }, { quoted: m });
    }

    if (decodedTargetId === m.sender && system.getOwnerList().length === 1) {
        return criv.sendMessage(m.chat, { text: `❌ Anda tidak bisa menghapus diri sendiri jika Anda adalah satu-satunya owner.` }, { quoted: m });
    }

    await system.removeOwner(decodedTargetId);
    return criv.sendMessage(m.chat, { text: `✅ Berhasil menghapus ${decodedTargetId.split('@')[0]} dari daftar owner.` }, { quoted: m, mentions: [decodedTargetId] });
  }
};
