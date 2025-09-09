import axios from 'axios'
  export default {
  command: ['pinterest', 'pin'],
  tag: 'search',
owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {
    if (!text) return m.reply(global.msg.query)
      try {
      const res = await axios.get('https://apidl.asepharyana.tech/api/search/pinterest', {
        params: { query: text },
        headers: { 'User-Agent': 'okhttp/4.5.0' }
      })
        const hasil = res.data
      if (!Array.isArray(hasil) || hasil.length === 0) {
        return m.reply('Tidak ada gambar ditemukan, coba kata kunci lain.')
      }
        const randImg = hasil[Math.floor(Math.random() * 2)]
      const imgUrl = randImg?.directLink
        if (!imgUrl || typeof imgUrl !== 'string' || !/^https?:\/\//.test(imgUrl)) {
        return m.reply('Gagal memuat gambar, URL tidak valid.')
      }
        const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' })
      const buffer = Buffer.from(imgRes.data)
        await criv.sendMessage(m.chat, {
        image: buffer,
        caption: `> Hasil pencarian: *${text}*\nSumber: Pinterest\nLink: ${randImg.link}`
      }, { quoted: m })
      } catch (e) {
      console.error('Error Pinterest:', e)
      m.reply('Terjadi kesalahan saat mengambil gambar.')
    }
  }
}