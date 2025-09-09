import axios from 'axios'
export default {
  command: ['lirik', 'lyrics', 'lagu'],
  tag: 'search',
owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 15,
  cooldown: 5000,
    async run(criv, { m, text }) {
    if (!text) return m.reply('Masukkan judul lagunya!')
      try {
      const res = await axios.get(`https://api.vreden.my.id/api/lirik?lagu=${encodeURIComponent(text)}`)
      const data = res.data?.result
        if (!data || !data.lirik) return m.reply('Lirik tidak ditemukan.')
        let msg = `> *Judul:* ${data.judul}\n`
      msg += `> *Artis:* ${data.artis}\n`
      msg += `> *Album:* ${data.album || '-'}\n\n`
      msg += `*Lirik:*\n${data.lirik}`
        criv.sendMessage(m.chat, { text: msg }, { quoted: m })
      } catch (e) {
      console.error(e)
      m.reply('Terjadi kesalahan saat mengambil data lirik.')
    }
  }
}