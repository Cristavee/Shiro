import axios from 'axios'

export default {
  command: ['openai'],
  tag: 'ai',
  description: 'Tanya ke OpenAI',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 3000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(global.msg.query)

    try {
      const res = await axios.get('https://www.veloria.my.id/ai/openai', {
        params: { text },
        headers: { 'User-Agent': 'okhttp/5.0' }
      })

      const data = res?.data
      if (!data?.status || !data?.result) return m.reply(global.msg.error)

      m.reply(data.result)
    } catch (err) {
      console.error(err)
      m.reply(global.msg.error)
    }
  }
}