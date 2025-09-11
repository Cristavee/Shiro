import axios from 'axios'

export default {
  command: ['kbbi', 'kamus'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 3,
  cooldown: 3000,
  async run(criv, { m, text }) {
    if (!text) return m.reply('Masukkan kata yang ingin dicari di KBBI.\nContoh: .kbbi sadrah')

    try {
      const url = `https://api.siputzx.my.id/api/s/kbbi?q=${encodeURIComponent(text)}`
      const res = await axios.get(url)
      const data = res.data

      if (!data.status || !data.data || data.data.length === 0) {
        return m.reply(`Arti kata "${text}" tidak ditemukan di KBBI`)
      }

      const result = data.data[0]
      let msgText = `Hasil KBBI untuk "*${result.title}*":\n\n`

      result.means.forEach((mean, i) => {
        const clean = mean.replace(/^(?:a|adv|v|n|ki|kl|kp|kb|kt|num|p|pron|s|u|l|bd|ark)\s*/gi, '').trim()
        msgText += ` ${i + 1}. ${clean}\n`
      })

      await criv.sendMessage(m.chat, { text: msgText }, { quoted: m })

    } catch (err) {
      console.error('KBBI error:', err)
      m.reply('Terjadi kesalahan saat mencari di KBBI')
    }
  }
}