import axios from 'axios'

export default {
  command: ['artinama', 'namaarti', 'nama'],
  tag: 'fun',
  description: 'Cek arti sebuah nama',
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('Silakan masukkan nama.\nContoh: .artinama Budi')

    try {
      const { data } = await axios.get(`https://api.siputzx.my.id/api/primbon/artinama?nama=${encodeURIComponent(text)}`)
      if (!data?.status || !data?.data) return m.reply('Nama tidak ditemukan atau API bermasalah.')

      const arti = data.data.arti || 'Tidak ada arti tersedia.'
      const catatan = data.data.catatan || ''
      const nama = data.data.nama || text

      const caption = `📛 *Arti Nama*: ${nama}\n\n*Arti:* ${arti}\n\n*Catatan:* ${catatan}`.trim()

      await criv.sendMessage(m.chat, { text: caption }, { quoted: m })

    } catch (err) {
      console.error('Error artinama:', err)
      m.reply('Gagal mengambil arti nama. Coba lagi nanti.')
    }
  }
}