import axios from 'axios'

export default {
  command: ['text2image', 'img', 'txt2img'],
  tag: 'ai',
  public: true,
  coin: 20,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('❓ Masukkan prompt untuk membuat gambar.')

    try {
      const { data } = await axios.get('https://api.vreden.my.id/api/v1/artificial/text2img', {
        params: { prompt: text },
        timeout: 60000
      })

      if (!data?.status || !data?.result?.download) {
        return m.reply('❌ Gagal membuat gambar.')
      }

      const { download, prompt } = data.result
      await criv.sendMessage(m.chat, {
        image: { url: download },
        caption: `✅ *Generated from prompt:*\n${prompt}`
      }, { quoted: m })

    } catch (err) {
      console.error('Error text2img:', err?.response?.data || err.message)
      m.reply('⚠️ Terjadi kesalahan saat menghubungi API.')
    }
  }
}