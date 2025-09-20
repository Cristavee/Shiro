import axios from 'axios'

async function getLahelu() {
  const apiUrl = 'https://api.siputzx.my.id/api/r/lahelu'
  const res = await axios.get(apiUrl)
  return res.data
}

export default {
  command: ['lahelu', 'meme', 'lh'],
  tag: 'random',
  public: true,
  cooldown: 5000,
  async run(criv, { m }) {
    try {
      const result = await getLahelu()
      if (!result.status || !result.data.length) {
        return m.reply('Tidak ada data Lahelu ditemukan')
      }

      const post = result.data[Math.floor(Math.random() * result.data.length)]
      let mediaUrl = null

      const mp4 = post.content.find(c => c.value.endsWith('.mp4'))
      const webp = post.content.find(c => c.value.endsWith('.webp'))

      const caption = `*${post.title || 'Tanpa Judul'}*\n` +
        `${post.totalUpvotes} up | ${post.totalDownvotes} down\n` +
        `${post.totalComments} komentar\n` +
        `By: ${post.userInfo?.username || 'Anonim'}\n` +
        `ID: ${post.postID}`

      if (mp4) {
        mediaUrl = mp4.value
        await criv.sendMessage(m.chat, { video: { url: mediaUrl }, caption }, { quoted: m })
      } else if (webp) {
        mediaUrl = webp.value
        await criv.sendMessage(m.chat, { image: { url: mediaUrl }, caption }, { quoted: m })
      } else {
        return m.reply('Media tidak ditemukan pada post ini')
      }

    } catch (err) {
      console.error('Lahelu error:', err)
      m.reply('Terjadi kesalahan saat mengambil data Lahelu')
    }
  }
}