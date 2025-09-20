export default {
  command: ['emojimix', 'mix'], 
  tag: 'fun',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: true,
  coin: 10,
  cooldown: 5000,
    async run(criv, { m, text }) {
    const nsfw = `https://www.veloria.my.id/random/nsfw`
      await criv.sendMessage(m.chat, {
      image: { url: nsfw }
    }, { quoted: m })
  }
}