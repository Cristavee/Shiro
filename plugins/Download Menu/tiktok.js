import axios from 'axios'

export default {
  command: ['tiktok', 'tt', 'ttdl', 'ttmp3'],
  tag: 'download',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('Masukkan URL TikTok!')

    try {
      const api = `https://api.vreden.my.id/api/tiktok?url=${encodeURIComponent(text)}`
      const { data } = await axios.get(api)

      if (data.status !== 200 || !data.result?.status) {
        return m.reply('Gagal mengambil data dari TikTok. Pastikan URL valid.')
      }

      const meta = data.result
      const author = meta.author || {}
      const music = meta.music_info || {}
      const stats = meta.stats || {}

      const clean = (txt = '') => txt.replace(/#[^\s#]+/g, '').trim()

      const cap = `
> Author     : ${author.fullname || '-'} (@${author.nickname || '-'})
> Audio      : ${clean(music.title) || '-'}
> Deskripsi  : ${clean(meta.title) || '-'}
> Views      : ${stats.views || 0}
> Likes      : ${stats.likes || 0}
> Comments   : ${stats.comment || 0}
> Shares     : ${stats.share || 0}
`.trim()

      const videoUrl = meta.data.find(v => v.type === 'nowatermark_hd')?.url
        || meta.data.find(v => v.type === 'nowatermark')?.url

      if (!videoUrl) {
        return m.reply('URL video tidak ditemukan.')
      }

      try {
        await criv.sendMessage(m.chat, {
          video: { url: videoUrl },
          caption: cap
        }, { quoted: m })
      } catch (vidErr) {
        console.error('Error kirim video:', vidErr)
        m.reply('Gagal mengirim video. URL mungkin tidak valid atau tidak bisa diakses.')
      }

      if (music.url) {
        try {
          await criv.sendMessage(m.chat, {
            audio: { url: music.url },
            mimetype: 'audio/mpeg',
            fileName: clean(music.title) || 'tiktok_audio.mp3',
            ptt: false
          }, { quoted: m })
        } catch (audErr) {
          console.error('Error kirim audio:', audErr)
        }
      }

    } catch (err) {
      console.error('Error:', err)
      m.reply('Terjadi kesalahan saat mengunduh video TikTok.')
    }
  }
}