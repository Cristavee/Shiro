import axios from 'axios'

export default {
  command: ['anime', 'mal'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 3,
  cooldown: 5000,
  async run(criv, { m, text }) {
    if (!text) return m.reply('Masukkan judul anime\nContoh: .anime Charlotte')

    try {
      const res = await axios.get('https://apidl.asepharyana.tech/api/weebs/anime-info', {
        params: { query: text }
      })

      const data = res.data
      if (!data || !data.title) return m.reply('Anime tidak ditemukan')

      const synopsis = await criv.translate(data.synopsis)

      const caption = `
*${data.title}*
───────────────────────
Type: ${data.type}
Score: ${data.score}
Members: ${data.members.toLocaleString()}
Status: ${data.status}
Favorites: ${data.favorites}
Genres: ${data.genres}
URL: ${data.url}

Synopsis:
${synopsis}
      `.trim()

      await criv.sendMessage(m.chat, { image: { url: data.images.jpg.image_url }, caption }, { quoted: m })

    } catch (err) {
      console.error('Anime error:', err)
      m.reply('Terjadi kesalahan saat mengambil data anime')
    }
  }
}