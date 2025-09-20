import axios from 'axios'

export default {
  command: ['artinama', 'namaarti', 'nama'],
  tag: 'fun',
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('Silakan masukkan nama.\nContoh: .artinama Budi')

    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/primbon/artinama?nama=${encodeURIComponent(text)}`
      )

      if (!data?.status || !data?.data) {
        return m.reply('Nama tidak ditemukan atau API bermasalah.')
      }

      const arti = data.data.arti || 'Tidak ada arti tersedia.'
      const catatan = data.data.catatan || '-'
      const nama = data.data.nama || text

      const hasil = `
> *Nama:* ${nama}
> *Arti:* ${arti}
> *Catatan:* ${catatan}
      `.trim()

      await criv.sendMessage(m.chat, { text: hasil }, { quoted: m })
    } catch (err) {
      console.error('artinama error:', err)
      m.reply('Gagal mengambil arti nama, coba lagi nanti.')
    }
  }
}