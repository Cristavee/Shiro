import axios from 'axios'

export default {
  command: ['spotify', 'spt'],
  tag: 'download',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text, msg }) {
    if (!text) {
      return criv.sendMessage(
        m.chat,
        { text: msg.query },
        { quoted: m }
      )
    }

    try {
      const api = `https://api.vreden.my.id/api/v1/download/spotify?url=${encodeURIComponent(text)}`
      const { data } = await axios.get(api, { timeout: 15000 })

      const res = data?.result
      if (!data?.status || !res?.download) {
        return criv.sendMessage(
          m.chat,
          { text: msg.error },
          { quoted: m }
        )
      }

      const duration = Math.floor(res.duration_ms / 1000)
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60

      const info = `
Spotify Downloader
────────────────────
> Judul   : ${res.title}
> Artis  : ${res.artists}
> Album  : ${res.album}
> Durasi : ${minutes}:${seconds.toString().padStart(2, '0')}
> Rilis  : ${res.release_date}
      `.trim()

      await criv.sendMessage(
        m.chat,
        {
          image: { url: res.cover_url },
          caption: info
        },
        { quoted: m }
      )

      await criv.sendMessage(
        m.chat,
        {
          audio: { url: res.download },
          mimetype: 'audio/mpeg',
          fileName: `${res.title}.mp3`
        },
        { quoted: m }
      )

    } catch (err) {
      console.error(err)
      criv.sendMessage(
        m.chat,
        { text: msg.error },
        { quoted: m }
      )
    }
  }
}