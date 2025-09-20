import axios from 'axios'

export default {
  command: ['ai'],
  tag: 'ai',
  public: true,

  async run(criv, { m, text }) {
    if (!text) text = 'hi'

    try {
      const res = await axios.get('https://apidl.asepharyana.tech/api/ai/chatgpt', {
        params: {
          prompt: `You are a smart assistant who speaks ${criv.lang}, kind, genius, and charismatic. When asked your name, respond ${global.bot.name}. When asked your creator, respond ${global.bot.ownerName}.`,
          text
        }
      })

      if (!res.data?.success || !res.data?.result) {
        return criv.sendMessage(m.chat, { text: 'Gagal mendapatkan respon dari AI.' }, { quoted: m })
      }

      await criv.sendMessage(m.chat, {
        text: res.data.result,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: global.bot.name,
            thumbnailUrl: global.thumb,
            mediaType: 1,
            renderLargerThumbnail: false
          },
          isForwarded: true
        },
        footer: global.footer
      }, { quoted: m })

    } catch (err) {
      console.error('AI Error:', err?.response?.data || err.message)
      criv.sendMessage(m.chat, { text: 'Terjadi kesalahan saat mengambil respon AI.' }, { quoted: m })
    }
  }
}