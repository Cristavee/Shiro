import axios from 'axios'

export default {
  command: ['heroml', 'ml'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 10,
  cooldown: 5000,
  async run(criv, { m, text }) {
    if (!text) return m.reply(msg.query)

    try {
      const res = await axios.get(`https://api.vreden.my.id/api/hero?query=${encodeURIComponent(text)}`)
      const data = res.data?.result
      if (!data) return m.reply('Hero tidak ditemukan')

      let msgText = `*Nama Hero:* ${text}\n`
      msgText += `*Full Name:* ${data.story_info_list?.['Full name'] || '-'}\n`
      msgText += `*Alias:* ${data.story_info_list?.Alias || '-'}\n`
      msgText += `*Role:* ${data.role || '-'}\n`
      msgText += `*Specialty:* ${data.specialty || '-'}\n`
      msgText += `*Lane:* ${data.lane || '-'}\n`
      msgText += `*Release:* ${data.release || '-'}\n`
      msgText += `*Price:* ${data.price || '-'}\n`
      msgText += `*Deskripsi:* ${data.desc?.trim() || '-'}\n\n`
      msgText += `*Gameplay Info:*\n`
      msgText += `- Durability: ${data.gameplay_info?.durability || '-'}\n`
      msgText += `- Offense: ${data.gameplay_info?.offense || '-'}\n`
      msgText += `- Control: ${data.gameplay_info?.control_effect || '-'}\n`
      msgText += `- Difficulty: ${data.gameplay_info?.difficulty || '-'}`

      await criv.sendMessage(
        m.chat,
        { image: { url: data.hero_img }, caption: msgText },
        { quoted: m }
      )

    } catch (err) {
      console.error('HeroML error:', err)
      m.reply('Terjadi kesalahan saat mengambil data hero')
    }
  }
}