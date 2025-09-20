import axios from 'axios'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'

export default {
  command: ['tourl'],
  tag: 'utility',
  public: true,
  async run(criv, { m, text }) {
    const host = (text || 'catbox').toLowerCase()
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

      if (host === 'catbox') {
        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', fs.createReadStream(tempPath))
        const { data: res } = await axios.post('https://catbox.moe/user/api.php', form, {
          headers: form.getHeaders()
        })
        url = res.trim()

      } else if (host === '0x0') {
        const form = new FormData()
        form.append('file', fs.createReadStream(tempPath))
        const { data: res } = await axios.post('https://0x0.st', form, {
          headers: form.getHeaders()
        })
        url = res.trim()

      } else {
        return m.reply('❌ Host tidak dikenal!\nGunakan salah satu: catbox, 0x0')
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

      await criv.sendMessage(m.chat, sendOptions)

    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message)
      m.reply('❌ Terjadi kesalahan saat upload.')
    } finally {
      // Hapus file sementara
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
    }
  }
}