import axios from 'axios'

export default {
  command: ['stickpin', 'spin'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 30000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(global.msg.query)

    let args = text.split(' ')
    let count = 1
    let query = 'stiker whatsapp ' + text

    // Cek apakah argumen terakhir adalah jumlah stiker
    const lastArg = parseInt(args[args.length - 1])
    if (!isNaN(lastArg) && lastArg > 0) {
      if (lastArg > 5) return m.reply('Jumlah stiker tidak boleh lebih dari 5')
      count = lastArg
      query = args.slice(0, -1).join(' ')
    }

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/s/pinterest', {
        params: { query, type: 'image' }
      })

      if (!data?.status || !Array.isArray(data.data) || data.data.length === 0) {
        return m.reply(`Gambar untuk "${query}" tidak ditemukan.`)
      }

      const results = data.data
      const numStickersToSend = Math.min(count, results.length)
      const sentUrls = new Set()

      for (let i = 0; i < numStickersToSend; i++) {
        let selectedUrl = null
        let attempts = 0

        // Pilih gambar unik
        while (attempts < results.length * 2) {
          const randomIndex = Math.floor(Math.random() * results.length)
          const candidate = results[randomIndex]?.image_url
          if (candidate && !sentUrls.has(candidate)) {
            selectedUrl = candidate
            break
          }
          attempts++
        }

        if (!selectedUrl) {
          console.warn(`Gagal memilih gambar unik untuk stiker ke-${i + 1}`)
          continue
        }

        try {
          const res = await axios.get(selectedUrl, { responseType: 'arraybuffer' })
          await criv.sleep(2)
          await criv.sendAsSticker(m.chat, Buffer.from(res.data), { quoted: m })
          sentUrls.add(selectedUrl)
        } catch (err) {
          console.error(`Gagal mengirim stiker dari URL: ${selectedUrl}`, err)
        }
      }

      if (sentUrls.size === 0) {
        m.reply('❌ Gagal mengirim stiker. Semua percobaan gagal.')
      }

    } catch (err) {
      console.error('StickPin Error:', err)
      m.reply(global.msg.error)
    }
  }
}