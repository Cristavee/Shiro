export default {
  command: ['loli'], 
  tag: 'random',
owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: false,
  coin: 10,
  cooldown: 5000,
    async run(criv, { m, text }) {
        
    const loli = `https://www.veloria.my.id/random/loli`
    
      await criv.sendMessage(m.chat, {
      image: { url: loli },
      caption: `Random loli`
    }, { quoted: m })
  }
}