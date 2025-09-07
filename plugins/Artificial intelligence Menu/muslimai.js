import axios from 'axios'

export default {
  command: ['muslimai', 'aimuslim', 'aiislam', 'muslim'], 
  tag: 'ai', 
  description: 'Chat dengan ai muslim.', 
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
try {
  const url = 'https://api.siputzx.my.id/api/ai/muslimai'
  const data = await axios.get(url, { params: { query: text}})
  const res = data.data.data
  
  await m.reply(res)
    } catch (e) {
        console.log(e)
        m.reply(msg.error)
    }
  }
}