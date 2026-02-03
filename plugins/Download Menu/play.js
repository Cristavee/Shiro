import axios from 'axios'

export default {
  command: ['play', 'musik', 'music'],
  tag: 'download',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text, msg }) {
    if (!text) return m.reply(global.msg.query)

    try {
      const api = `https://api.vreden.my.id/api/v1/download/play/audio?query=${encodeURIComponent(text)}`
      const res = await axios.get(api, { timeout: 15000 })

      const result = res?.data?.result
      if (!result?.status || !result?.metadata) {
        return criv.reply(m, msg.error)
      }

      const meta = result.metadata
      const dl = result.download

      const caption = `
> Judul   : ${meta.title}
> Durasi : ${meta.duration?.timestamp || '-'}
> Views  : ${meta.views?.toLocaleString() || '-'} kali
> Channel: ${meta.author?.name || '-'}
> Link   : ${meta.url}

> Memproses audio...
      `.trim()

      await criv.sendImage(
        m.chat,
        meta.thumbnail || meta.image,
        caption,
        m
      )

      if (!dl?.status || !dl?.url) {
        return criv.reply(
          m,
          ` Audio gagal diproses oleh server.\n\nAlasan: ${dl?.message || 'Unknown error'}`
        )
      }

 
      const audioRes = await axios.get(dl.url, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': '*/*'
        }
      })

      const buffer = Buffer.from(audioRes.data)
      const fileName = dl.filename || `${meta.title}.mp3`

      await criv.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          fileName
        },
        { quoted: m }
      )

      await criv.sendReaction(m.chat, m.key, '🎶')

    } catch (err) {
      console.error('[PLAY ERROR]', err?.message || err)
      criv.reply(m, msg.error)
    }
  }
}