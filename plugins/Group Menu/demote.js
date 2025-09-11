export default {
  command: ['demote', 'dm'],
  tag: 'group',
  owner: false,
  admin: true,
  botAdmin: true,
  public: false,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 5000,
  async run(criv, { m, mentioned, quoted, msg }) {
    const targetJid = mentioned || (quoted && quoted.sender)
    if (!targetJid) return m.reply(msg.reply)

    try {
      await criv.groupParticipantsUpdate(m.chat, [targetJid], 'demote')
      await m.reply(`✅ Berhasil menurunkan @${targetJid.split('@')[0]} menjadi anggota biasa.`)
    } catch (e) {
      console.error('Error saat menurunkan anggota:', e)
      await m.reply(msg.error)
    }
  }
}