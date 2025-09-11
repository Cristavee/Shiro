export default {
  command: ['neko'], 
  tag: 'nsfw',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: true,
  coin: 10,
  cooldown: 5000,
    async run(criv, { m, text }) {
    const nsfw = `https://api.vreden.my.id/api/neko`
      await criv.sendMessage(m.chat, {
      image: { url: nsfw }
    }, { quoted: m })
  }
}