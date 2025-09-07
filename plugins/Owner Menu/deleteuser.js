export default {
  command: ['deleteuser', 'deluser'],
  tag: 'owner',
  description: 'Hapus data user dari database.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,

  async run(criv, { m, db, args, prefix, command }) {
    const target = m.quoted?.sender || m.mentionedJid?.[0] || args[0]

    if (!target) return criv.reply(m, `> Tag atau reply user.\nContoh: *${prefix + command} @user*`)
    const id = typeof target === 'string' ? target : target.id

    if (!system.getAllUsers()[id]) {
      return criv.reply(m, `> User tidak ditemukan dalam database.`)
    }

    delete db.data.users[id]
    await system.saveDb()

    criv.reply(m, `> Data user ${id.replace(/@.+/, '')} berhasil dihapus dari database.`)
  }
}