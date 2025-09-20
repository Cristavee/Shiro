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

  async run(criv, { m, text }) {
    if (!text) {
      return criv.sendMessage(m.chat, { text: msg.query }, { quoted: m })
    }

    try {
      const api = `https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(text)}`
      const { data } = await axios.get(api)
      const res = data?.result

      if (!res?.status || !res?.music) {
        return criv.sendMessage(m.chat, { text: msg.error }, { quoted: m })
      }

      const info = `
*Spotify Downloader*
────────────────────
> Judul : ${res.title}
> Artis : ${res.artists}
> Rilis : ${res.releaseDate}
> Tipe  : ${res.type}
`.trim()

      await criv.sendMessage(m.chat, {
        image: { url: res.cover },
        caption: info
      }, { quoted: m })

      await criv.sendMessage(m.chat, {
        audio: { url: res.music },
        mimetype: 'audio/mpeg',
        fileName: `${res.title}.mp3`
      }, { quoted: m })

    } catch (err) {
      console.error(err)
      criv.sendMessage(m.chat, { text: msg.error }, { quoted: m })
    }
  }
}