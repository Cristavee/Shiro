import axios from 'axios'

export default {
  command: ['catfact', 'factcat'],
  tag: 'random',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m }) {
    try {
      const res = await axios.get('https://apis.davidcyriltech.my.id/random/catfact')
      const fact = await criv.translate(res.data.fact)
      m.reply('*Funfact Kucing:*\n' + fact)
    } catch (err) {
      m.reply('Gagal mengambil funfact kucing')
      console.error(err)
    }
  }
}