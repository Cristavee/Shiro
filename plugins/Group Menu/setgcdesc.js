export default {
  command: ['setdescgc', 'gcdesc'],
  tag: 'group',
  owner: false,
  admin: true,
  botAdmin: true,
  public: false,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(msg.query || '❌ Masukkan deskripsi yang ingin diubah.')

    try {
      await criv.groupUpdateDescription(m.chat, text)
      await m.reply('✅ Deskripsi grup berhasil diubah.')
    } catch (error) {
      console.error('[ERROR] Gagal mengubah deskripsi grup:', error)
      await m.reply('❌ Gagal mengubah deskripsi. Pastikan saya admin grup.')
    }
  }
}