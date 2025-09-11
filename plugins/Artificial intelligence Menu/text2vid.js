import axios from 'axios'

export default {
  command: ['vidai', 'aivid'],
  tag: 'ai',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 15000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(global.msg.query)

    try {
      const res = await axios.get('https://www.veloria.my.id/aivid/txt2video', {
        params: { prompt: text },
        headers: { 'User-Agent': 'okhttp/5.0' }
      })

      const data = res?.data
      if (!data?.status || !data?.result) {
        return m.reply(global.msg.error)
      }

      await criv.sendVideo(m.chat, data.result, { quoted: m })
    } catch (err) {
      console.error(err)
      m.reply(global.msg.error)
    }
  }
}