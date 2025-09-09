import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
  async function up(buffer) {
  const form = new FormData()
  form.append('files[]', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' })
    try {
    const { data: res } = await axios.post('https://uguu.se/upload.php', form, {
      headers: form.getHeaders(),
    })
    
    if (res.error) {
        throw new Error('Upload gagal: ' + res.error.message)
    }
      const url = res.files?.[0]?.url
      if (!url) {
        throw new Error('Respons upload tidak valid.')
    }
    
    return url
  } catch (err) {
    if (err.response) {
      throw new Error(`Upload gagal dengan status ${err.response.status}: ${err.response.statusText}`)
    } else if (err.request) {
      throw new Error('Tidak ada respons dari server Uguu.se.')
    } else {
      throw new Error('Error saat mengunggah: ' + err.message)
    }
  }
}
  async function hitamkan(url, filter = 'hitam') {
  const apiUrl = `https://apidl.asepharyana.tech/api/ai/negro?url=${encodeURIComponent(url)}&filter=${filter}`
    const res = await axios.get(apiUrl, {
    responseType: 'arraybuffer',
  })
    if (res.headers['content-type'] && !res.headers['content-type'].startsWith('image')) {
    throw new Error('API tidak mengembalikan gambar.')
  }
    return Buffer.from(res.data)
}
  export default {
  command: ['hitam', 'gelap', 'hytam', 'ireng', 'kumar'],
  tag: 'utility',
public: true,
  cooldown: 5000,
  coin: 10,
    async run(criv, { m, args }) {
      // catatan : carbon, hitam, coklat, piggy, nerd, botak 
    const validFilters = ['hitam', 'coklat', 'nerd', 'piggy']
const filter = args[0]?.toLowerCase() || 'hitam'
if (filter === 'list') {
  const list = `*Daftar Filter yang Tersedia:*\n\n${validFilters.map((f, i) => `> ${i+1}. *${f}*`).join('\n')}`
  return m.reply(list)
}
    const quoted = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
    const mime = (quoted?.msg || quoted || {}).mimetype || ''
      if (!/image/.test(mime)) {
      return criv.reply(m, '📸 Kirim atau reply gambar dulu!')
    }
      try {
      const buffer = await criv.downloadMediaMessage(quoted)
      const url = await up(buffer)
      
      if (!validFilters.includes(filter)) {
          return criv.reply(m, `❌ Filter tidak valid. Pilih salah satu dari: ${validFilters.join(', ')}`)
      }
        const hasil = await hitamkan(url, filter)
        await criv.sendMessage(m.chat, { image: hasil, caption: `Gambar *di${filter}kan*` }, { quoted: m })
    } catch (err) {
      console.error('Hitamkan error:', err)
      criv.reply(m, '❌ Gagal menghitamkan gambar. Coba lagi nanti.')
    }
  }
}
