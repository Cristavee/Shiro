import axios from 'axios'

export default {
  command: ['spotifysearch', 'sps'],
  tag: 'search',
  public: true,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('❌ Masukkan judul lagu yang ingin dicari.\nContoh: .spotifysearch Blinding Lights')

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/s/spotify', {
        params: { query: text }
      })

      const result = data?.data
      if (!Array.isArray(result) || result.length === 0) {
        return m.reply('⚠️ Lagu tidak ditemukan, coba kata kunci lain.')
      }

      const res = result[0] // Ambil hasil pertama
      const teks = `
> *Judul:* ${res.title}
> *Artis:* ${res.artist}
> *Album:* ${res.album}
> *Durasi:* ${res.duration}
> *Rilis:* ${res.release_date}
> *Link:* ${res.track_url}
> *Preview:* ${res.preview_url || 'Tidak tersedia'}
`.trim()

      await criv.sendMessage(m.chat, {
        image: { url: res.thumbnail },
        caption: teks,
        interactiveButtons: [
          {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "Copy URL",
              id: res.track_url,
              copy_code: res.track_url
            })
          }
        ]
      }, { quoted: m })
      
    } catch (err) {
      console.error('Spotify Search Error:', err)
      m.reply('❌ Terjadi kesalahan saat mengambil lagu dari Spotify. Silakan coba lagi nanti.')
    }
  }
}