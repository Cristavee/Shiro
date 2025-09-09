export default {
  command: ['delete', 'del', 'hapus'],
tag: 'utility',
  public: true,
    async run(criv, { m, isOwner, isAdmin, isBotAdmin }) {
    if (!m.quoted) return m.reply('⚠️ Reply ke pesan yang mau dihapus!')
      const msgKey = m.quoted.key
    const botJid = criv.user.id.split(':')[0] + '@s.whatsapp.net'
    const fromBot = (m.quoted.sender === botJid)
      if (fromBot) {
      if (!(m.isOwner || m.isAdmin)) {
        return m.reply('⚠️ Hanya *Admin / Owner* yang boleh hapus pesan bot!')
      }
    } else {
      if (!m.isAdmin) return m.reply('⚠️ Hanya *Admin* yang boleh hapus pesan orang lain!')
      if (!m.isBotAdmin) return m.reply('⚠️ Bot harus *Admin* untuk bisa hapus pesan!')
    }
      try {
      await criv.sendMessage(m.chat, { delete: msgKey })
    } catch (e) {
      console.error(e)
      return m.reply('❌ Gagal menghapus pesan.')
    }
  }
}