import axios from 'axios'

export default {
  command: ['brat'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m, text }) {
      
    if (!text || !text.trim())
      return m.reply('⚠️ Kirim teks untuk membuat stiker Brat.\nContoh: .brat hai saha')

    try {
      const apiUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text.trim())}`  
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 15000 })
      const buffer = Buffer.from(response.data)

      if (!buffer || buffer.length === 0) throw new Error('Buffer kosong dari API')

      await criv.sendAsSticker(m.chat, buffer, { quoted: m })
    } catch (e) {
      console.error('[BRAT ERROR]', e)
      await m.reply('❌ Gagal membuat stiker. Coba lagi nanti.')
    }
  }
}