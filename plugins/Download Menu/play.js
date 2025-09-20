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
      const res = await axios.get(api)
      const result = res?.data?.result

      if (!result?.status || !result?.download?.url) {
        return criv.reply(m, msg.error)
      }

      const { title, url: video, thumbnail, duration, views, author } = result.metadata
      const { url: link, filename } = result.download
      const fileName = filename || `${title}.mp3`

      const cap = `
> Judul   : ${title}
> Durasi  : ${duration?.timestamp || '-'}
> Views   : ${views?.toLocaleString() || '-'} kali
> Channel : ${author?.name || '-'}
> Link    : ${video}
> Format  : MP3 128kbps

> Mengirim audio, tunggu sebentar...
      `.trim()

      await criv.sendImage(m.chat, thumbnail, cap)

      const dl = await axios.get(link, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' },
        timeout: 20000,
        validateStatus: () => true
      })

      const buffer = Buffer.from(dl.data)
      await criv.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          ptt: false,
          fileName
        },
        { quoted: m }
      )
    } catch (e) {
      console.error(e)
      criv.reply(m, msg.error)
    }

    await criv.sendReaction(m.chat, m.key, '')
  }
}