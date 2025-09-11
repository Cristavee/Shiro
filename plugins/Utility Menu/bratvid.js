import axios from 'axios'
import { spawn } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

export default {
  command: ['bratvid'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 7000,
  async run(criv, { m, text }) {
    if (!text || !text.trim()) {
      return m.reply('⚠️ Kirim teks untuk membuat stiker animasi.\nContoh: .bratvid hai kawan')
    }

    try {
      const apiUrl = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text.trim())}&width=512&height=512&delay=500&endDelay=1000`

      const res = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 20000 })
      const gifBuffer = Buffer.from(res.data)

      if (!gifBuffer || gifBuffer.length === 0) throw new Error('Buffer GIF kosong dari API')

      const tmpGifPath = path.join(os.tmpdir(), `temp-${Date.now()}.gif`)
      const tmpWebpPath = path.join(os.tmpdir(), `temp-${Date.now()}.webp`)
      fs.writeFileSync(tmpGifPath, gifBuffer)

      await new Promise((resolve, reject) => {
        const ff = spawn('ffmpeg', [
          '-i', tmpGifPath,
          '-vcodec', 'libwebp',
          '-filter:v', 'fps=fps=15,scale=512:512:flags=lanczos',
          '-loop', '0',
          '-preset', 'default',
          '-an',
          '-vsync', '0',
          tmpWebpPath
        ])
        ff.on('error', reject)
        ff.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg gagal')))
      })

      const webpBuffer = fs.readFileSync(tmpWebpPath)
      await criv.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m })

      fs.unlinkSync(tmpGifPath)
      fs.unlinkSync(tmpWebpPath)
    } catch (e) {
      console.error('[bratvid error]', e)
      m.reply('❌ Gagal membuat stiker animasi. Coba lagi nanti.')
    }
  }
}