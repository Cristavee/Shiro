export default {
  command: ['translate', 'tr', 'terjemahkan'], 
  tag: 'utility',
owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false, // false = bisa di private juga
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {
    try {
      // kalau user reply pesan
      if (m.quoted && !text) {
        text = m.quoted.message?.conversation || ''
      }
        if (!text) {
        return m.reply('❓ Contoh penggunaan:\n.tr halo dunia, en\n\nFormat: teks, kode_bahasa\nKode default: id (Indonesia)')
      }
        // pisahkan teks & target bahasa
      let [mess, to] = text.split(',').map(s => s.trim())
      if (!mess) mess = text
      if (!to) to = 'id' // default Indonesia
        // translate
      const hasil = await criv.translate(mess, to)
        await m.reply(`🌐 *Hasil Translate (${to.toUpperCase()})*\n\n${hasil}`)
    } catch (e) {
      console.error('Translate error:', e)
      m.reply('❌ Gagal menerjemahkan teks.')
    }
  }
}