import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

export default {
  command: ['stiker', 'sticker', 's'],
  tag: 'utility',
  coin: 10,
  async run(criv, { m }) {
    // Ambil media dari reply atau kirim langsung
    const media = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
    if (!media) return m.reply('Balas atau kirim gambar/video/stiker dengan caption: .stiker')

    const type = media.mediaType || media.mtype || ''
    if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(type)) {
      return m.reply('Hanya mendukung gambar, video, atau stiker.')
    }

    try {
      const buffer = await media.download?.()
      if (!buffer) return m.reply('❌ Gagal mengunduh media.')

      let stickerBuffer = buffer

      // Jika video atau GIF, ubah ke webp animasi
      if (type === 'videoMessage') {
        const tmpFile = path.join('./tmp', `video_${Date.now()}.mp4`)
        const tmpSticker = path.join('./tmp', `sticker_${Date.now()}.webp`)
        fs.writeFileSync(tmpFile, buffer)

        await new Promise((resolve, reject) => {
          const ff = spawn('ffmpeg', [
            '-i', tmpFile,
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,fps=15',
            '-t', '6',
            '-loop', '0',
            '-an',
            '-f', 'webp',
            tmpSticker
          ])
          ff.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg error')))
        })

        stickerBuffer = fs.readFileSync(tmpSticker)
        fs.unlinkSync(tmpFile)
        fs.unlinkSync(tmpSticker)
      }

      await criv.sendAsSticker(m.chat, stickerBuffer, {
        quoted: m,
        packname: global.pack || global.bot.name,
        author: global.author || global.bot.ownerName
      })
    } catch (err) {
      console.error(err)
      m.reply('❌ Gagal membuat stiker.')
    }
  }
}