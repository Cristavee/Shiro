import axios from 'axios'

export default {
  command: ['sfile'],
  tag: 'search',
  description: 'Cari file dari Sfile',
  public: true,
  coin: 30,

  async run(criv, { m, text }) {
    if (!text) return m.reply('❌ Masukkan kata kunci!\nContoh: .sfile script skin ml')

    try {
      const { data } = await axios.get(`https://api.asagiofficial.idnet.my.id/search/sfile?q=${encodeURIComponent(text)}`)

      if (!data?.status || !data?.result?.length) {
        return m.reply('❌ Tidak ada hasil ditemukan.')
      }

      const results = data.result.slice(0, 10).map((v, i) => {
        return `*${i + 1}. ${v.title}*\n📦 Size: ${v.size}\n🔗 Link: ${v.link}`
      }).join('\n\n')

      const caption = `📂 *Hasil Pencarian Sfile*\n\n${results}`

      await criv.sendMessage(m.chat, {
        text: caption,
        footer: `Ditemukan ${data.result.length} file`,
        contextInfo: {
          externalAdReply: {
            title: "🔎 Sfile Search",
            body: "Pencarian file dari Sfile.mobi",
            mediaType: 1,
            thumbnailUrl: "https://i.ibb.co/NTsfL7z/sfile.png",
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })

    } catch (err) {
      console.error('Sfile Search Error:', err)
      m.reply('❌ Terjadi kesalahan saat mencari file.')
    }
  }
}