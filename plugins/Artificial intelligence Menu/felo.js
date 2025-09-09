import axios from 'axios'
export default {
  command: ['felo'], 
  tag: 'ai', 
  description: '', 
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,
    
  async run(criv, { m,  text }) {
      if (!text) text = 'hai'
      const conf = `jawab dengan bahasa ${criv.lang}: `
      
     try {
      const res = await axios.get(`https://api.siputzx.my.id/api/ai/felo?query=${encodeURIComponent(conf+text)}`)   
      const has = res.data.data.answer
  await criv.sendMessage(m.chat, {
  text: has,
  contextInfo: {
    externalAdReply: {
      showAdAttribution: false,
      title: "Felo",
      thumbnailUrl: 'https://pomf2.lain.la/f/6m59zb9h.webp',
      mediaType: 1,
      renderLargerThumbnail: false
    },
    isForwarded: true
  },
  ephemeralExpiration: 32000,
  footer: global.footer
}, {
  quoted: {
    key: {
      remoteJid: '0@s.whatsapp.net',
      fromMe: false,
      id: 'BAE5F1E87A7CABA5F74A3213DE6B1C9B'
    },
    message: {
      conversation: 'Hai ' + m.pushName
    }
  }
})
         } catch(e) {
             console.log(e)
             m.reply(msg.error)
       }
  }
}