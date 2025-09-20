import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['addowner', 'addown'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,

  async run(criv, { m, args, mentioned = [], system }) {
    try {
      let targetId = null;

      // Tentukan target dari mention atau nomor
      if (mentioned.length > 0) {
        targetId = mentioned[0];
      } else if (args[0] && /\d+/.test(args[0])) {
        targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      }

      if (!targetId) {
        return criv.sendMessage(m.chat, { 
          text: `🚩 Penggunaan salah.\nTag pengguna atau berikan nomornya.\nContoh: *.addowner @user* atau *.addowner 62812xxxxxx*` 
        }, { quoted: m });
      }

      const decodedTargetId = decodeJid(targetId);

      // Cek apakah sudah owner
      if (system.isOwner(decodedTargetId)) {
        return criv.sendMessage(m.chat, { 
          text: `⚠️ Pengguna @${decodedTargetId.split('@')[0]} sudah menjadi owner.` 
        }, { quoted: m, mentions: [decodedTargetId] });
      }

      // Tambah owner
      await system.addOwner(decodedTargetId);

      return criv.sendMessage(m.chat, { 
        text: `✅ Berhasil menambahkan @${decodedTargetId.split('@')[0]} sebagai owner baru.` ,
        mentions: [decodedTargetId]
      }, { quoted: m });

    } catch (err) {
      console.error('Error addowner:', err);
      await criv.sendMessage(m.chat, { text: '❌ Terjadi kesalahan saat menambahkan owner.' }, { quoted: m });
    }
  }
};