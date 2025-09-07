import axios from 'axios'

export default {
  command: ['heroml', 'ml'],
  tag: 'search',
  description: 'Cari informasi hero Mobile Legends',
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
      if (!data) return m.reply('Hero tidak ditemukan.')

      let msg = `> *Nama Hero:* ${text}\n`
      msg += `> *Full Name:* ${data.story_info_list?.['Full name'] || '-'}\n`
      msg += `> *Alias:* ${data.story_info_list?.Alias || '-'}\n`
      msg += `> *Role:* ${data.role}\n`
      msg += `> *Specialty:* ${data.specialty}\n`
      msg += `> *Lane:* ${data.lane}\n`
      msg += `> *Release:* ${data.release}\n`
      msg += `> *Price:* ${data.price}\n`
      msg += `> *Deskripsi:* ${data.desc?.trim() || '-'}\n\n`
      msg += ` *Gameplay Info:*\n`
      msg += `- Durability: ${data.gameplay_info?.durability}\n`
      msg += `- Offense: ${data.gameplay_info?.offense}\n`
      msg += `- Control: ${data.gameplay_info?.control_effect}\n`
      msg += `- Difficulty: ${data.gameplay_info?.difficulty}\n`

      criv.sendMessage(m.chat, {
        image: { url: data.hero_img },
        caption: msg
      }, { quoted: m })

    } catch (e) {
      console.error(e)
      m.reply('Terjadi kesalahan saat mengambil data hero.')
    }
  }
}