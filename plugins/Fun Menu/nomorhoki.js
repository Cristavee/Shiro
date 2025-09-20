import axios from 'axios'

async function cekNomor(nomor) {
  const apiUrl = `https://api.siputzx.my.id/api/primbon/nomorhoki?phoneNumber=${encodeURIComponent(nomor)}`
  const res = await axios.get(apiUrl)
  return res.data
}

export default {
  command: ['nomorhoki', 'cekno', 'nohoki'],
  tag: 'fun',
  public: true,
  cooldown: 5000,
  coin: 5,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Masukkan nomor HP!\n\nContoh: `.nomorhoki 6281234567890`')
    }

    if (!/^\d+$/.test(text.trim())) {
      return m.reply('⚠️ Nomor hanya boleh berisi angka.')
    }

    try {
      const result = await cekNomor(text.trim())
      if (!result.status || !result.data) {
        return m.reply('⚠️ Nomor tidak valid atau gagal dianalisis.')
      }

      const data = result.data
      const pos = data.energi_positif
      const neg = data.energi_negatif

      const message = `
🔮 *Analisis Nomor Hoki*
📱 Nomor: ${data.nomor}

✨ *Angka Bagua Shuzi*: ${data.angka_bagua_shuzi.value}%
> ${data.angka_bagua_shuzi.description}

💫 *Energi Positif*: ${pos.total}%
> Kekayaan: ${pos.details.kekayaan}  
> Kesehatan: ${pos.details.kesehatan}  
> Cinta: ${pos.details.cinta}  
> Kestabilan: ${pos.details.kestabilan}  
${pos.description}

⚡ *Energi Negatif*: ${neg.total}%
> Perselisihan: ${neg.details.perselisihan}  
> Kehilangan: ${neg.details.kehilangan}  
> Malapetaka: ${neg.details.malapetaka}  
> Kehancuran: ${neg.details.kehancuran}  
${neg.description}

📊 *Kesimpulan*:
${data.analisis.status ? '✅ Nomor ini dianggap *HOKI*!' : '❌ Nomor ini dianggap kurang hoki.'}
      `.trim()

      await criv.sendMessage(m.chat, { text: message }, { quoted: m })
    } catch (err) {
      console.error('Nomor Hoki error:', err)
      m.reply('❌ Terjadi kesalahan saat menganalisis nomor.')
    }
  }
}