export default {
  command: ['husbu', 'randomhusbu'], 
  tag: 'random',owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m, text }) {
      
    const hus = `https://api.asagiofficial.idnet.my.id/random/husbu`
    
    await criv.sendMessage(m.chat, {
      image: { url: hus },
      caption: `Random Husbu!`
    }, { quoted: m })
  }
}