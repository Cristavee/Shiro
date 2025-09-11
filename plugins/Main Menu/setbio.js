export default {
  command: ['setbio'],
  tag: 'main',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 2,
  cooldown: 30000,
    async run(criv, {
    system,
    m,
    sender,
    text,
    pushName
  }) {
        
    if (!text) return m.reply('Kirim bio baru kamu!\nContoh: .setbio Aku adalah pengguna setia bot ini.')
        
      await system.setBio(sender, text)
      m.reply(`> Bio kamu berhasil diatur:\n${text}`)
  }
}