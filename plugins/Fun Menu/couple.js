export default {
  command: ['couple', 'coupletag'],
  tag: 'fun',
  group: true, 
  public: true,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m }) {
    try {
     const groupMetadata = await criv.groupMetadata(m.chat)
      const participants = groupMetadata.participants
        .filter(p => !p.admin && !p.isBot)
        .map(p => p.id)

      if (participants.length < 2) {
        return m.reply('⚠️ Anggota grup kurang dari 2, tidak bisa membuat couple.')
      }

      let firstIndex = Math.floor(Math.random() * participants.length)
      let secondIndex
      do {
        secondIndex = Math.floor(Math.random() * participants.length)
      } while (secondIndex === firstIndex)

      const user1 = participants[firstIndex]
      const user2 = participants[secondIndex]

      const messages = [
        "❤️ Pasangan terpilih hari ini adalah",
        "💞 Couple of the day:",
        "🥰 Jodoh ditentukan oleh bot:",
        "💘 Duo romantis pilihan bot:"
      ]
      const msgText = `${messages[Math.floor(Math.random() * messages.length)]}\n\n@${user1.split('@')[0]} 💌 @${user2.split('@')[0]}`

      await criv.sendMessage(m.chat, {
        text: msgText,
        mentions: [user1, user2]
      })
    } catch (err) {
      console.error('❌ CoupleTag error:', err)
      m.reply('⚠️ Terjadi kesalahan saat memilih couple.')
    }
  }
}
