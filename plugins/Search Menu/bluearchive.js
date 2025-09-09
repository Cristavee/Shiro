export default {
  command: ['bluearchive', 'ba'], 
  tag: 'search',
owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: false,
  coin: 10,
  cooldown: 5000,
    async run(criv, { m, text }) {
    const waifu = `https://zenz.biz.id/random/ba`
      await criv.sendMessage(m.chat, {
      image: { url: waifu },
      caption: `Suspicious!`
    }, { quoted: m })
  }
}