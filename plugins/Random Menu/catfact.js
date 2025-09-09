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
  const data = await axios.get('https://apis.davidcyriltech.my.id/random/catfact')
  const fact = await criv.translate(data.data.fact)
  m.reply('*Funfact Kucing:*\n'+ fact)
  }
}