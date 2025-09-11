import axios from 'axios'

export default {
  command: ['soundcloud', 'sc'],
  tag: 'download',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Masukkan link SoundCloud!\nContoh: .soundcloud https://m.soundcloud.com/')
    }

    try {
      const res = await axios.get(`https://api.nasirxml.my.id/download/soundcloud?url=${encodeURIComponent(text)}`)
      const data = res.data.result

      if (!data || !data.url) {
        return m.reply('Gagal mengambil data dari SoundCloud.')
      }

      const info = `
*SoundCloud Downloader*
───────────────────────
> Judul     : ${data.title}
> Author    : ${data.author.username}
> Profile   : ${data.author.permalink_url}
> Followers : ${data.author.followers_count}
> Likes     : ${data.author.likes_count}
`.trim()

      await criv.sendMessage(m.chat, {
        image: { url: data.thumbnail },
        caption: info
      }, { quoted: m })

      await criv.sendMessage(m.chat, {
        audio: { url: data.url },
        mimetype: 'audio/mp4',
        fileName: `${data.title}.mp3`
      }, { quoted: m })

    } catch (err) {
      console.error(err)
      m.reply('Terjadi kesalahan saat download dari SoundCloud.')
    }
  }
}