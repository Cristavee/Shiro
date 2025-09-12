import axios from 'axios'

export default {
  command: ['deepseek'],
  tag: 'ai',
  public: true,

  async run(criv, { m, text }) {
    if (!text) text = 'hai'

    try {
      const { data } = await axios.get('https://apidl.asepharyana.tech/api/ai/deepseek', {
        params: {
          text,
          prompt: `kamu ai berbahasa ${criv.lang} dan menggunakan emoji jika perlu`
        }
      })

      const res = data?.answer
      if (!res) {
        return criv.sendMessage(m.chat, {
          text: '❌ Gagal mendapatkan balasan dari DeepSeek.'
        }, { quoted: m })
      }

      await criv.sendMessage(m.chat, {
        text: res,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: 'DeepSeek',
            thumbnailUrl: 'https://pomf2.lain.la/f/9fv3t58i.jpg',
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
      console.error('DeepSeek Error:', err?.response?.data || err.message)
      criv.sendMessage(m.chat, {
        text: '❌ Terjadi kesalahan saat menghubungi DeepSeek.'
      }, { quoted: m })
    }
  }
}
