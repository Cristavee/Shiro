import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['delprem', 'removepremium'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, args, mentioned, system }) {
    try {
      let targetId = null;

      // Tentukan target dari mention atau argumen
      if (Array.isArray(mentioned) && mentioned.length > 0) {
        targetId = mentioned[0];
      } else if (args[0] && /\d+/.test(args[0])) {
        targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      }

      if (!targetId) {
        return criv.sendMessage(
          m.chat,
          { text: `🚩 Penggunaan salah. Tag pengguna atau berikan nomornya.\nContoh: *.delprem @${m.sender.split('@')[0]}* atau *.delprem 62812xxxxxx*` },
          { quoted: m }
        );
      }

      const decodedTargetId = decodeJid(targetId);

      // Pastikan user sudah terdaftar
      system.addUser(decodedTargetId);

      // Cek jika user bukan premium
      if (!system.isPremium(decodedTargetId)) {
        return criv.sendMessage(
          m.chat,
          { text: `⚠️ Pengguna ${decodedTargetId.split('@')[0]} bukan premium.` },
          { quoted: m }
        );
      }

      // Hapus status premium
      await system.setPremium(decodedTargetId, false);

      return criv.sendMessage(
        m.chat,
        { text: `✅ Berhasil menghapus ${decodedTargetId.split('@')[0]} dari daftar premium.` },
        { quoted: m, mentions: [decodedTargetId] }
      );
    } catch (err) {
      console.error('Error delprem:', err);
      criv.sendMessage(m.chat, { text: `❌ Terjadi kesalahan: ${err.message}` }, { quoted: m });
    }
  }
};