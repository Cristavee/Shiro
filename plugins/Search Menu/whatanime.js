import axios from 'axios'
import FormData from 'form-data'
  async function up(buffer, filename) {
  const form = new FormData()
  form.append('files[]', buffer, { filename })
    const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
  })
    if (data.files && data.files[0]) {
    return data.files[0].url
  } else {
    throw new Error('Upload gagal')
  }
}
  async function identify(url) {
  const apiUrl = `https://api.siputzx.my.id/api/tools/identify-anime?imageUrl=${encodeURIComponent(url)}`
  const res = await axios.get(apiUrl)
  return res.data
}
  export default {
  command: ['identify', 'animeapa', 'whatanime', 'traceanime', 'searchanime'],
  tag: 'search',
public: true,
  cooldown: 5000,
  coin: 15,
    async run(criv, { m }) {
    const quoted = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
    const mime = (quoted?.msg || quoted)?.mimetype || ''
      if (!/image/.test(mime)) {
      return criv.reply(m, 'Balas atau kirim gambar untuk mencari anime.')
    }
      try {
      const buffer = await criv.downloadMediaMessage(quoted)
      const url = await up(buffer, 'anime.jpg')
      const result = await identify(url)
        if (!result.status || !result.data) {
        return criv.reply(m, 'Anime tidak ditemukan.')
      }
        const data = result.data
      const refs = (data.references || [])
        .map(r => `🌐 ${r.site}: ${r.url}`)
        .join('\n') || '-'
        const syn = await criv.translate(data.synopsis || '-')
      const desc = await criv.translate(data.description || '-')
        const message = `
🎬 *Hasil Identifikasi Anime*
> *Anime*: ${data.anime}
> *Karakter*: ${data.character}
> *Genre*: ${data.genres}
> *Tayang Perdana*: ${data.premiere}
> *Studio*: ${data.production}
  📝 *Deskripsi*:
${desc}
  📖 *Sinopsis*:
${syn}
  🔗 *Referensi*:
${refs}
`.trim()
        await criv.sendImage(m.chat, data.image, message, m)
    } catch (err) {
      console.error('Identify Anime error:', err)
      criv.reply(m, 'Gagal mengidentifikasi anime.')
    }
  }
}