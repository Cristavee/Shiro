export default {
  command: ['delete', 'del', 'hapus'],
  tag: 'utility',
  public: true,

  async run(criv, { m, isOwner, isAdmin, isBotAdmin }) {
    if (!m.quoted) return m.reply('⚠️ Reply ke pesan yang mau dihapus!');

    const msgKey = m.quoted.key;
    const botJid = criv.user.id.split(':')[0] + '@s.whatsapp.net';
    const fromBot = (m.quoted.sender === botJid);

    // Cek hak akses
    if (fromBot) {
      if (!(isOwner || isAdmin)) {
        return m.reply('⚠️ Hanya *Admin / Owner* yang boleh hapus pesan bot!');
      }
    } else {
      if (!isAdmin) return m.reply('⚠️ Hanya *Admin* yang boleh hapus pesan orang lain!');
      if (!isBotAdmin) return m.reply('⚠️ Bot harus *Admin* untuk bisa hapus pesan!');
    }

    // Hapus pesan
    try {
      await criv.sendMessage(m.chat, { delete: msgKey });
    } catch (err) {
      console.error('Delete message error:', err);
      m.reply('❌ Gagal menghapus pesan.');
    }
  }
};