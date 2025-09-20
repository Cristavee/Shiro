import axios from 'axios'

export default {
  command: ['news', 'cnbc'],
  tag: 'random',
  public: true,
  cooldown: 3000,

  async run(criv, { m }) {
    try {
      const res = await axios.get('https://api.siputzx.my.id/api/berita/cnbcindonesia')
      const data = res.data.data

      if (!data || !data.length) return m.reply('Berita tidak ditemukan.')

      const top = data.slice(0, 5)
      const teks = top.map((item, i) => {
        return `> ${i + 1}. ${item.title}\n> ${item.date || '-'}\n> ${item.link}`
      }).join('\n\n')

      const image = await axios.get(top[0].image, { responseType: 'arraybuffer' }).then(res => res.data)

      await criv.sendMessage(m.chat, {
        image,
        caption: teks
      }, { quoted: m })

    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil berita. Silakan coba lagi nanti.')
    }
  }
}