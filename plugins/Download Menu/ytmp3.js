import fetch from 'node-fetch'

export default {
  command: ['ytmp3', 'yta'],
  tag: 'download',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(global.msg.query)

    const api = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text.trim())}`

    try {
      const res = await fetch(api)
      if (!res.ok) throw new Error('Gagal menghubungi API')

      const json = await res.json()
      if (!json?.result?.download?.url) return m.reply(global.msg.error)

      const {
        title,
        duration,
        thumbnail,
        author
      } = json.result.metadata

      const {
        url: audioUrl,
        quality,
        filename
      } = json.result.download

      const cap = `
*Audio Ditemukan:*
> Judul   : ${title}
> Durasi  : ${duration.timestamp}
> Channel : ${author.name}
> Quality : ${quality}
> Link    : ${text.trim()}
`.trim()

      await criv.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: cap
      }, { quoted: m })

      const audioRes = await fetch(audioUrl)
      const buffer = await audioRes.buffer()

      await criv.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: filename || 'yt-audio.mp3'
      }, { quoted: m })

    } catch (err) {
      console.error('[ytmp3 error]', err)
      m.reply(global.msg.error)
    }
  }
}