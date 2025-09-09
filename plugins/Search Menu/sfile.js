import axios from 'axios'
export default {
  command: ['sfile'],
  tag: 'search',public: true,
  async run(criv, { m, text, args }) {
    if (!text) return m.reply('❌ Masukkan kata kunci!\nContoh: .sfile script skin ml')
    try {
      const { data } = await axios.get(`https://api.asagiofficial.idnet.my.id/search/sfile?q=${encodeURIComponent(text)}`)
      if (!data?.status || !data?.result?.length) {
        return m.reply('❌ Tidak ada hasil ditemukan.')
      }
      const results = data.result.slice(0, 10).map((v, i) => {
        return `*${i + 1}. ${v.title}*\n📦 Size: ${v.size}\n🔗 Link: ${v.link}\n`
      }).join('\n')
      const caption = `📂 *Hasil Pencarian Sfile*\n\n${results}`
      await criv.sendMessage(m.chat, { 
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: "🔎 Sfile Search",
            body: data.result.length + ' File',
            mediaType: 1,
            thumbnailUrl: "https://d.uguu.se/QcGhXXXv.jpeg",
            renderLargerThumbnail: false
          }
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('❌ Terjadi kesalahan saat mencari file.')
    }
  }
}