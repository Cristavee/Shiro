import axios from 'axios'
  export default {
  command: ['quotes', 'pesan', 'motivasi'], 
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
        
  const data = await axios.get('https://apis.davidcyriltech.my.id/random/quotes')
  
  const has = data.data.quote
  const qu = await criv.translate(has.text)
  m.reply('*"'+qu+'"*' + `\n\n_- ${has.author}_`)
  }
}