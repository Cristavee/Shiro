import axios from 'axios'

export default {
  command: ['llama', 'llamaai'],
  tag: 'ai',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) text = 'hai'

    const prompt = `
gunakan bahasa ${criv.lang}, 
namamu Shiro, penciptamu bernama Cristave. 
Kamu hanya akan menjawab siapa namamu dan siapa penciptamu ketika ditanya. 
Jika tidak, jawab sesuai pertanyaan.
    `.trim()

    try {
      const res = await axios.get(
        `https://api.siputzx.my.id/api/ai/llama33?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(text)}`
      )

      const ans = res.data.data

      await criv.sendMessage(m.chat, {
        text: ans,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'Llama',
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
            conversation: 'Hai ' + (m.pushName || 'Kak')
          }
        }
      })

    } catch (err) {
      console.error('Llama Error:', err?.response?.data || err.message)
      m.reply(msg.error)
    }
  }
}