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
      const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text.trim())}`
      try {
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error('Gagal menghubungi API.')
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
        await criv.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption: `*Audio Ditemukan:*
  > *Judul:* ${title}
> *Durasi:* ${duration.timestamp}
> *Channel:* ${author.name}
> *Quality:* ${quality}
> *Link:* ${text.trim()}`,
      }, { quoted: m })
        const audioRes = await fetch(audioUrl)
      const audioBuffer = await audioRes.buffer()
        await criv.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: filename || 'yt-audio.mp3'
      })
      } catch (err) {
      console.error('[ytmp3 error]', err)
      m.reply(global.msg.error)
    }
  }
}