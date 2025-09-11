import axios from 'axios'

export default {
  command: ['ytmp4', 'ytv'],
  tag: 'download',
  public: true,
  premium: false,
  coin: 10,
  cooldown: 8000,

  async run(criv, { m, args, helpers }) {
    const url = args[0]
    if (!url || !url.match(/(youtu\.be|youtube\.com)/i)) {
      return m.reply(msg.query)
    }

    try {
      const { data } = await axios.get(`https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`)
      if (!data?.result?.download?.url) {
        return m.reply('Gagal mengambil data video.')
      }

      const { metadata: meta, download } = data.result

      const caption = [
        `> *Judul:* ${meta.title}`,
        `> *Channel:* ${meta.author.name}`,
        `> *Durasi:* ${meta.duration.timestamp}`,
        `> *Views:* ${meta.views.toLocaleString()}x`,
        `> *Upload:* ${meta.ago}`,
        `> *Kualitas:* ${download.quality}`,
        '',
        'Mengirim video...'
      ].join('\n')

      await criv.sendMessage(m.chat, {
        image: { url: meta.thumbnail },
        caption
      }, { quoted: m })

      await criv.sendMessage(m.chat, {
        video: { url: download.url }
      })

    } catch (err) {
      console.error(err)
      m.reply('Terjadi kesalahan saat mengunduh video.')
    }
  }
}