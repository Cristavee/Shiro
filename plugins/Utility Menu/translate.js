export default {
  command: ['translate', 'tr', 'terjemahkan'], 
  tag: 'utility',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m, text }) {
    try {
      // Ambil teks dari reply jika ada dan text kosong
      if (!text && m.quoted) {
        const quotedMsg = m.quoted.message
        if (quotedMsg?.conversation) text = quotedMsg.conversation
        else if (quotedMsg?.extendedTextMessage?.text) text = quotedMsg.extendedTextMessage.text
        else text = ''
      }

      if (!text) {
        return m.reply('❓ Contoh penggunaan:\n.tr halo dunia, en\n\nFormat: teks, kode_bahasa\nKode default: id (Indonesia)')
      }

      // Pisahkan teks & target bahasa
      let [mess, to] = text.split(',').map(s => s.trim())
      if (!mess) mess = text
      if (!to) to = 'id' // default bahasa Indonesia

      // Translate
      const hasil = await criv.translate(mess, to)
      await m.reply(`🌐 *Hasil Translate (${to.toUpperCase()})*\n\n${hasil}`)

    } catch (e) {
      console.error('Translate error:', e)
      m.reply('❌ Gagal menerjemahkan teks.')
    }
  }
}