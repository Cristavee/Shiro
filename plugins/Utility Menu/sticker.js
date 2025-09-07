import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

export default {
  command: ['stiker', 'sticker', 's'],
  tag: 'utility',
  description: 'Ubah gambar atau video menjadi stiker.',
  coin: 10,

  async run(criv, { m }) {
    const media = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
    if (!media) return m.reply('Balas atau kirim gambar/video dengan caption:\n.stiker')

    const type = media.mediaType || media.mtype || ''
    if (!['imageMessage', 'videoMessage'].includes(type)) {
      return m.reply('Hanya mendukung gambar atau video.')
    }

    const buffer = await media.download?.()
    if (!buffer) return m.reply('> Gagal mengunduh media.')

    const tmpFile = path.join('./tmp', `${Date.now()}_${type === 'videoMessage' ? 'video' : 'image'}`)
    fs.writeFileSync(tmpFile, buffer)

    try {
      let stickerBuffer

      if (type === 'imageMessage') {
        stickerBuffer = buffer
      } else if (type === 'videoMessage') {
        const tmpSticker = tmpFile + '.webp'

        await new Promise((resolve, reject) => {
          const ff = spawn('ffmpeg', [
            '-i', tmpFile,
            '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,fps=15',
            '-t', '3',
            '-loop', '0',
            '-ss', '0',
            '-an',
            '-f', 'webp',
            tmpSticker
          ])

          ff.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg error')))
        })

        stickerBuffer = fs.readFileSync(tmpSticker)
        fs.unlinkSync(tmpSticker)
      }

      await criv.sendAsSticker(m.chat, stickerBuffer, {
        quoted: m,
        packname: global.pack,
        author: global.author
      })
    } catch (e) {
      console.error(e)
      m.reply('Gagal membuat stiker.')
    } finally {
      fs.unlinkSync(tmpFile)
    }
  }
}