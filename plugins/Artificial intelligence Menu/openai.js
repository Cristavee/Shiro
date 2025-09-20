import axios from 'axios'

export default {
  command: ['openai'],
  tag: 'ai',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 3000,

  async run(criv, { m, text }) {
    if (!text) text = 'hai'

    const prompt = `jawab dengan bahasa ${criv.lang}: ${text}`
    try {
      const res = await axios.get('https://www.veloria.my.id/ai/openai', {
        params: { text: prompt },
        headers: { 'User-Agent': 'okhttp/5.0' }
      })

      const ans = res.data
      if (!ans?.status || !ans?.result) return m.reply(global.msg.error)

      await m.reply(ans.result)

    } catch (err) {
      console.error('OpenAI Error:', err?.response?.data || err.message)
      m.reply(global.msg.error)
    }
  }
}