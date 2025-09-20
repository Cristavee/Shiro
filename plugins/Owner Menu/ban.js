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

  async run(criv, { m, text, mentioned, args, system }) {
    try {
      // Cek target user
      let targetId = null;
      if (Array.isArray(mentioned) && mentioned.length > 0) {
        targetId = mentioned[0];
      } else if (args[0] && args[0].match(/\d+/)) {
        targetId = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      }

      if (!targetId) {
        return criv.sendMessage(m.chat, { text: `🚩 Penggunaan salah. Tag pengguna atau masukkan nomor.\nContoh: *.ban @user* atau *.ban 62812xxxxxx*` }, { quoted: m });
      }

      const decodedTargetId = decodeJid(targetId);

      // Cegah ban owner
      if (system.isOwner(decodedTargetId)) {
        return criv.sendMessage(m.chat, { text: `⚠️ Tidak bisa memblokir owner bot.` }, { quoted: m });
      }

      // Pastikan user sudah terdaftar
      system.addUser(decodedTargetId);

      // Cek apakah user sudah diblokir
      if (system.isUserBanned(decodedTargetId)) {
        return criv.sendMessage(m.chat, { text: `⚠️ Pengguna ${decodedTargetId.split('@')[0]} sudah diblokir.` }, { quoted: m });
      }

      // Lakukan ban
      await system.banUser(decodedTargetId);
      return criv.sendMessage(m.chat, { 
        text: `✅ Berhasil memblokir ${decodedTargetId.split('@')[0]} dari penggunaan bot.` , 
        quoted: m, 
        mentions: [decodedTargetId] 
      });

    } catch (err) {
      console.error('Error ban user:', err);
      return criv.sendMessage(m.chat, { text: `❌ Terjadi kesalahan saat mencoba memblokir pengguna.` }, { quoted: m });
    }
  }
};