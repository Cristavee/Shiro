import axios from 'axios'

export default {
  command: ['perplexity', 'ppy', 'perplex'],
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
      const res = await axios.get('https://api.siputzx.my.id/api/ai/perplexity', {
        params: { 
          text: prompt, 
          model: 'sonar-pro' 
        }
      })

      const ans = res.data?.data?.output || res.data?.output || 'Tidak ada respon dari AI'

      await criv.sendMessage(m.chat, {
        text: ans,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'Perplexity',
            thumbnailUrl: 'https://pomf2.lain.la/f/bmb8jibr.jpg',
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
      console.error('Perplexity Error:', err?.response?.data || err.message)
      m.reply('❌ Terjadi kesalahan saat memproses permintaan.')
    }
  }
}
