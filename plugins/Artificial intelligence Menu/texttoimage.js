import axios from 'axios'
  export default {
  command: ['text2image', 'img', 'txt2img'],
  tag: 'ai',
owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 20,
  cooldown: 5000,
    async run(criv, { m, text }) {
    if (!text) return m.reply(msg.query)
      try {
      const url = `https://api.vreden.my.id/api/artificial/text2image?prompt=${encodeURIComponent(text)}`
      const { data } = await axios.get(url)
        if (!data?.result?.download || !data?.result?.status) {
        return m.reply('Gagal menghasilkan gambar.')
      }
        const res = data.result
      const info = `> Prompt: ${res.prompt}`
        await criv.sendImage(m.chat, res.download, info, m)
    } catch (err) {
      console.error(err)
      m.reply('Terjadi kesalahan saat menghubungi API Text2Image.')
    }
  }
}