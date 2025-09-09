import axios from 'axios'
export default {
  command: ['llama', 'llamaai'], 
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
      
     try {
      const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama33?prompt=gunakan%20bahasa%${criv.lang}%2C%20dan%20namamu%20shiro%2C%20penciptamu%20bernama%20Cristave%2C%20kamu%20hanya%20akan%20menjawab%20siapa%20namamu%20dan%20pencipta%20mu%20hanya%20ketika%20ditanya%2C%20jika%20tidak%20maka%20jawab%20sesuai%20pertanyaan&text=${encodeURIComponent(text)}`)   
      
      await criv.sendMessage(m.chat, {
  text: res.data.data,
  contextInfo: {
    externalAdReply: {
      showAdAttribution: false,
      title: "Llama",
      thumbnailUrl: 'https://pomf2.lain.la/f/nmi8mke3.png',
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