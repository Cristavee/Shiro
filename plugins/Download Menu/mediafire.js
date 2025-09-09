import axios from 'axios'
  export default {
  command: ['mediafire', 'mfire', 'mf'],
  tag: 'download',
public: true,
  premium: false,
  coin: 10,
  cooldown: 8000,
    async run(criv, { m, text }) {
    if (!text) return m.reply('⚠️ Masukkan URL Mediafire!')
      try {
      const apiUrl = `https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(text)}`
      const { data } = await axios.get(apiUrl)
        if (!data?.downloadLink) {
        return m.reply('Gagal mengambil data file dari Mediafire.')
      }
        const { fileName, mimeType, size, downloadLink } = data
        const caption = `📂 *Mediafire Downloader*\n\n`
        + `> Nama: ${fileName}\n`
        + `> Ukuran: ${size}\n`
        + `> Tipe: ${mimeType}\n\n`
        + `Sedang mengirim file...`
        await m.reply(caption)
        await criv.sendFile(
        m.chat,
        downloadLink,
        fileName,
        `✅ Berhasil mengunduh dari *Mediafire*\n\n📌 Nama: ${fileName}\n📦 Ukuran: ${size}`,
        m
      )
    } catch (err) {
      console.error(err)
      m.reply('❌ Terjadi kesalahan saat download dari Mediafire.')
    }
  }
}