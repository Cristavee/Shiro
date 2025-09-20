import { decodeJid } from '../../lib/helpers.js';

export default {
  command: ['delowner', 'delown'],
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
          { text: `🚩 Penggunaan salah. Tag pengguna atau berikan nomornya.\nContoh: *.delowner @${m.sender.split('@')[0]}* atau *.delowner 62812xxxxxx*` },
          { quoted: m }
        );
      }

      const decodedTargetId = decodeJid(targetId);

      // Cek jika target adalah owner utama
      if (decodedTargetId === (global.bot?.owner || '')) {
        return criv.sendMessage(m.chat, { text: '❌ Tidak dapat menghapus owner utama.' }, { quoted: m });
      }

      // Cek apakah target memang owner
      if (!system.isOwner(decodedTargetId)) {
        return criv.sendMessage(
          m.chat,
          { text: `⚠️ Pengguna ${decodedTargetId.split('@')[0]} bukan owner.` },
          { quoted: m }
        );
      }

      // Cek jika menghapus diri sendiri dan hanya ada 1 owner
      const ownerList = system.getOwnerList() || [];
      if (decodedTargetId === m.sender && ownerList.length === 1) {
        return criv.sendMessage(
          m.chat,
          { text: '❌ Anda tidak bisa menghapus diri sendiri jika Anda adalah satu-satunya owner.' },
          { quoted: m }
        );
      }

      // Hapus owner
      await system.removeOwner(decodedTargetId);
      return criv.sendMessage(
        m.chat,
        { text: `✅ Berhasil menghapus ${decodedTargetId.split('@')[0]} dari daftar owner.` },
        { quoted: m, mentions: [decodedTargetId] }
      );
    } catch (err) {
      console.error('Error delowner:', err);
      criv.sendMessage(m.chat, { text: `❌ Terjadi kesalahan: ${err.message}` }, { quoted: m });
    }
  }
};