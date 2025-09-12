import axios from 'axios'

export default {
  command: ['felo'],
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
    const prompt = `jawab dengan bahasa ${criv.lang}: ${text}`

    try {
      const res = await axios.get(`https://api.siputzx.my.id/api/ai/felo?query=${encodeURIComponent(prompt)}`)
      const ans = res.data.data.answer

      await criv.sendMessage(m.chat, {
        text: ans,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'Felo',
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
            conversation: 'Hai ' + (m.pushName || 'Kak')
          }
        }
      })

    } catch (err) {
      console.error('Felo Error:', err?.response?.data || err.message)
      m.reply(msg.error)
    }
  }
}
