import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

export default {
  command: ['stiker', 'sticker', 's'],
  tag: 'utility',
  coin: 10,
  async run(criv, { m }) {
    const media = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
    if (!media) return m.reply('⚠️ Balas/kirim gambar, video, GIF, atau stiker dengan caption: .stiker')

    const type = media.mediaType || media.mtype || ''
    if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(type)) {
      return m.reply('⚠️ Hanya mendukung gambar, video/GIF, atau stiker.')
    }

    try {
      const buffer = await media.download?.()
      if (!buffer) return m.reply('❌ Gagal mengunduh media.')

      let stickerBuffer = buffer
      const tmpDir = './tmp'
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

      if (type === 'imageMessage') {
        const tmpFile = path.join(tmpDir, `img_${Date.now()}.jpg`)
        const tmpSticker = path.join(tmpDir, `sticker_${Date.now()}.webp`)
        fs.writeFileSync(tmpFile, buffer)

        await new Promise((resolve, reject) => {
          const ff = spawn('ffmpeg', [
            '-i', tmpFile,
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease',
            '-vcodec', 'libwebp',
            '-lossless', '1',
            '-qscale', '80',
            '-preset', 'picture',
            tmpSticker
          ])
          ff.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg error')))
        })

        stickerBuffer = fs.readFileSync(tmpSticker)
        fs.unlinkSync(tmpFile)
        fs.unlinkSync(tmpSticker)
      }
        
      if (type === 'videoMessage') {
        const tmpFile = path.join(tmpDir, `vid_${Date.now()}.mp4`)
        const tmpSticker = path.join(tmpDir, `sticker_${Date.now()}.webp`)
        fs.writeFileSync(tmpFile, buffer)

        await new Promise((resolve, reject) => {
          const ff = spawn('ffmpeg', [
            '-i', tmpFile,
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,fps=15',
            '-vcodec', 'libwebp',
            '-lossless', '0',
            '-loop', '0',
            '-ss', '0',
            '-t', '10', 
            tmpSticker
          ])
          ff.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg error')))
        })

        stickerBuffer = fs.readFileSync(tmpSticker)
        fs.unlinkSync(tmpFile)
        fs.unlinkSync(tmpSticker)
      }
      if (type === 'stickerMessage') {
        stickerBuffer = buffer
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