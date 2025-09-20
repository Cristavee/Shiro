export default {
  command: ['deleteuser', 'deluser'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,

  async run(criv, { m, db, args, prefix, command, system }) {
    try {
      // Tentukan target user
      const target = m.quoted?.sender || m.mentionedJid?.[0] || args[0];
      if (!target) {
        return criv.sendMessage(m.chat, { text: `> Tag atau reply user.\nContoh: *${prefix + command} @user*` }, { quoted: m });
      }

      const id = typeof target === 'string' ? target : target.id;

      // Cek apakah user ada di database
      if (!system.getAllUsers()?.[id]) {
        return criv.sendMessage(m.chat, { text: `> User tidak ditemukan dalam database.` }, { quoted: m });
      }

      // Hapus data user
      delete db.data.users[id];
      await system.saveDb();

      criv.sendMessage(m.chat, { 
        text: `> Data user *${id.replace(/@.+/, '')}* berhasil dihapus dari database.` 
      }, { quoted: m });
    } catch (err) {
      console.error('Error deleteuser:', err);
      criv.sendMessage(m.chat, { text: `❌ Gagal menghapus user: ${err.message}` }, { quoted: m });
    }
  }
};