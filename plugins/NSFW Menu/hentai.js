import axios from 'axios'

  export default {
  command: ['hentai'], 
  tag: 'nsfw',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false, 
  premium: true,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m }) {
        
    try {
      const url = 'https://api.vreden.my.id/api/hentaivid'
      const { data } = await axios.get(url)
      
        if (!data || !data.result || !data.result.length) {
        return m.reply('❌ Gagal mengambil video.')
      }
        
        const ran = data.result[Math.floor(Math.random() * data.result.length)]
        
        const caption = `📛 *Title:* ${ran.title}
🔗 *Link:* ${ran.link}
👀 *Views:* ${ran.views_count}
📂 *Category:* ${ran.category}`
        
        await criv.sendMessage(m.chat, {
        video: { url: ran.video_1 },
        caption
      }, { quoted: m })
      } catch (e) {
      console.error(e)
      m.reply('❌ Terjadi error saat mengambil data.')
    }
  }
}