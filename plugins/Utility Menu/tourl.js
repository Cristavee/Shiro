import axios from 'axios'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'

export default {
  command: ['tourl'],
  tag: 'utility',
  public: true,
  async run(criv, { m, text }) {
    const host = (text || 'uguu').toLowerCase()
    const quoted = m.quoted || m
    const mime = quoted.mimetype || ''
    if (!mime) return m.reply('> Reply/kirim file media dulu!')

    const tempDir = './tmp'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const ext = mime.split('/')[1] === 'plain' ? 'txt' : mime.split('/')[1] || 'bin'
    const fileName = `upload-${Date.now()}.${ext}`
    const tempPath = path.join(tempDir, fileName)

    try {
      const buffer = await quoted.download?.()
      if (!buffer) return m.reply('> Gagal mengunduh media.')

      await fs.promises.writeFile(tempPath, buffer)
      let url

      if (host === 'uguu') {
        const form = new FormData()
        form.append('files[]', fs.createReadStream(tempPath))
        const { data: res } = await axios.post('https://uguu.se/upload.php', form, {
          headers: form.getHeaders()
        })
        url = res.files?.[0]?.url

      } else if (host === 'gofile') {
        const { data: serverRes } = await axios.get('https://api.gofile.io/getServer')
        const server = serverRes.data.server
        const form = new FormData()
        form.append('file', fs.createReadStream(tempPath))
        const { data: upload } = await axios.post(`https://${server}.gofile.io/uploadFile`, form, {
          headers: form.getHeaders()
        })
        url = upload.data.downloadPage

      } else if (host === 'fileio') {
        const form = new FormData()
        form.append('file', fs.createReadStream(tempPath))
        const { data: res } = await axios.post('https://file.io', form, {
          headers: form.getHeaders()
        })
        url = res.link

      } else {
        return m.reply('❌ Host tidak dikenal!\nGunakan salah satu: uguu, gofile, fileio')
      }

      if (!url) return m.reply('❌ Gagal upload file.')
      const teks = `> *URL* (${host}):\n${url}`

      // Kirim URL dengan preview jika file media
      const sendOptions = { text: teks, interactiveButtons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "Copy URL",
            id: url,
            copy_code: url
          })
        }
      ]}

      if (mime.startsWith('image') || mime.startsWith('video')) {
        sendOptions.image = { url }
      }

      await criv.sendMessage(m.chat, sendOptions, { quoted: m })

    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message)
      m.reply('❌ Terjadi kesalahan saat upload.')
    } finally {
      // Hapus file sementara
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
    }
  }
}