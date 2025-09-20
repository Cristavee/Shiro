export default {
  command: ['promote', 'pm'],
  tag: 'group',
  owner: false,
  admin: true,
  botAdmin: true,
  public: true,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, mentioned, quoted }) {
    const targetJid = mentioned || (quoted && quoted.sender)
    if (!targetJid) return m.reply('Tolong sebutkan anggota yang ingin dipromosikan.')

    try {
      await criv.groupParticipantsUpdate(m.chat, [targetJid], 'promote')
      await m.reply(`✅ Berhasil mempromosikan @${targetJid.split('@')[0]} menjadi admin grup.`, { mentions: [targetJid] })
    } catch (error) {
      console.error('[ERROR] Gagal mempromosikan:', error)
      await m.reply('❌ Gagal mempromosikan anggota. Pastikan saya admin grup dan target adalah anggota biasa.')
    }
  }
}