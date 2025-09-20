import axios from 'axios'

export default {
  command: ['chatgpt', 'gpt'],
  tag: 'ai',
  public: true,

  async run(criv, { m, text }) {
    if (!text) text = 'hi'

    try {
      const res = await axios.get('https://apidl.asepharyana.tech/api/ai/chatgpt', {
        params: {
          prompt: `you are a smart and speak ${criv.lang} assistant who is kind and genius and charismatic`,
          text
        }
      })

      if (!res.data?.success || !res.data?.result) {
        return criv.sendMessage(m.chat, {
          text: 'Gagal mendapatkan respon dari ChatGPT.'
        }, { quoted: m })
      }

      await criv.sendMessage(m.chat, {
        text: res.data.result,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'ChatGPT',
            thumbnailUrl: 'https://pomf2.lain.la/f/f4uea2ij.jpeg',
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
      console.error('AI Error:', err?.response?.data || err.message)
      criv.sendMessage(m.chat, {
        text: msg.error
      }, { quoted: m })
    }
  }
}
