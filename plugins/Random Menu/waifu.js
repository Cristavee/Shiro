export default {
  command: ['waifu', 'randomwaifu'], 
  tag: 'random',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {
        
    const waifu = `https://api.vreden.my.id/api/waifu`
    
      await criv.sendMessage(m.chat, {
      image: { url: waifu },
      caption: `Random Waifu!`
    }, { quoted: m })
  }
}