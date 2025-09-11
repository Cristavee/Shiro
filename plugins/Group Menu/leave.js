export default {
  command: ['leave', 'out'],
  tag: 'group',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 10000,

  async run(criv, { m }) {
    try {
      await m.reply('Saya akan keluar dari grup ini. Sayonara!')
      await criv.groupLeave(m.chat)
    } catch (error) {
      if (error.output?.statusCode === 403 || error.message.includes('not group admin')) {
        await m.reply('Maaf, saya tidak bisa keluar dari grup ini karena saya bukan admin grup.')
      } else {
        await m.reply('Terjadi kesalahan saat mencoba keluar dari grup. Silakan coba lagi.')
        console.error('Error leaving group:', error)
      }
    }
  }
}