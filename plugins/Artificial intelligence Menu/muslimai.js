import axios from 'axios'

export default {
  command: ['muslimai', 'aimuslim', 'aiislam', 'muslim'],
  tag: 'ai',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) text = 'hai'
    const prompt = `jawab dengan bahasa ${criv.lang}: ${text}`

    try {
      const res = await axios.get('https://api.siputzx.my.id/api/ai/muslimai', {
        params: { query: prompt }
      })

      const ans = res.data.data
      await m.reply(ans)

    } catch (err) {
      console.error('MuslimAI Error:', err?.response?.data || err.message)
      m.reply(msg.error)
    }
  }
}