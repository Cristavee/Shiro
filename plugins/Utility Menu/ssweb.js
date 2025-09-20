export default {
  command: ['ssweb', 'ss'], 
  tag: 'utility',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {
        
    if (!text) return m.reply('Masukkan URL yang ingin di-screenshot!\n\nContoh: *.ssweb https://google.com*')
        
      const ssURL = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(text)}&theme=light&device=desktop`
      
      await criv.sendMessage(m.chat, {
      image: { url: ssURL },
      caption: `> *Screenshot berhasil!*\n\n> URL: ${text}`
    }, { quoted: m })
  }
}