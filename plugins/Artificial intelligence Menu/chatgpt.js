import axios from 'axios'

export default {
  command: ['chatgpt', 'gpt'],
  tag: 'ai',
  description: 'Tanya AI GPT',
  public: true,

  async run(criv, { m, args, text}) {
    const content = text
    if (!content) return m.reply('Apa yang kamu tanyakan?')

    try {
      const res = await axios.get('https://apidl.asepharyana.tech/api/ai/chatgpt', {
        params: {
          prompt: `kamu asisten berbahasa ${criv.lang} yang jenius serta berkarisma`,
          text: content
        }
      })

      if (!res.data?.success || !res.data?.result) {
        return criv.sendMessage(m.chat, {
          text: 'Failed to get AI Response.'
        }, { quoted: m })
      }

      await criv.sendMessage(m.chat, {
  text: res.data.result,
  contextInfo: {
    externalAdReply: {
      showAdAttribution: false,
      title: "ChatGPT",
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
      conversation: 'Hai ' + m.pushName
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
