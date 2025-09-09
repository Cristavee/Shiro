import axios from 'axios'
import https from 'https'
export default {
  command: ['sfiledl', 'sfldl', 'sfdl'],
  tag: 'download',public: true,
  async run(criv, { m, text }) {
    if (!text) return m.reply('❌ Masukkan URL Sfile!\nContoh: .sfiledl https://sfile.mobi/65Np4ILcWco')
    try {
      const { data } = await axios.get(`https://api.vreden.my.id/api/sfile?url=${encodeURIComponent(text)}`)
      if (!data?.result?.download) return m.reply('❌ Gagal mendapatkan link download.')
      const { filesize, mimetype, download } = data.result
      const fileRes = await axios.get(download, {
        responseType: 'arraybuffer',
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      const buffer = Buffer.from(fileRes.data)
      await criv.sendFile(
        m.chat,
        buffer,
        mimetype?.split('/')[1] ? `sfile-download.${mimetype.split('/')[1]}` : 'sfile-download.bin',
        `✅ *Sfile Downloader*\n\n📦 Size: ${filesize || 'Unknown'}\n📂 Mime: ${mimetype || '-'}\n🔗 [Download Direct](${download})`,
        m,
        false,
        { mimetype }
      )
    } catch (err) {
      console.error('SfileDL Error:', err)
      m.reply('❌ Terjadi kesalahan saat mengunduh file dari Sfile.')
    }
  }
}