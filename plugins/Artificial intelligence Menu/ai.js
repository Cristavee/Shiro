import axios from 'axios'

export default {
  command: ['ai'],
  tag: 'ai',
  description: 'Ngobrol dengan AI!',
  public: true,

  async run(criv, { m, text, args }) {
    if (!text) text = 'hai'
    try {
      const { data } = await axios.get('https://apidl.asepharyana.tech/api/ai/v2/chatgpt', {
        params: {
          text,
          prompt: 'kamu ai berbahasa Indonesia dan menggunakan emoji jika perlu, saat ditanya namamu adalah Shiro dan saat ditanya siapa pencipta mu jawab Cristave',
          imageUrl: '',
          session: ''
        }
      })
      
      const res = data?.result

      if (!res) {
        return criv.sendMessage(m.chat, {
          text: 'Gagal mendapatkan balasan dari AI.'
        }, { quoted: m })
      }

      await criv.sendMessage(m.chat, {
  text: res,
  contextInfo: {
    externalAdReply: {
      showAdAttribution: false,
      title: "Shiro",
      thumbnailUrl: global.thumb,
      mediaType: 1,
      renderLargerThumbnail: true
    },
    isForwarded: true
  },
  footer: global.footer
}, { quoted: {
          key: {
            remoteJid: '0@s.whatsapp.net',
            fromMe: false,
            id: 'BAE5F1E87A7CABA5F74A3213DE6B1C9B'
          },
          message: {
            conversation: 'Hai ' + (m.pushName || 'Kak')
          }
        } })

    } catch (err) {
      console.error('AI Error:', err?.response?.data || err.message)
      criv.sendMessage(m.chat, {
        text: 'Terjadi kesalahan saat menghubungi AI.'
      }, { quoted: m })
    }
  }
}
