import axios from 'axios'

async function cekWeton(tgl, bln, thn) {
  const apiUrl = `https://api.siputzx.my.id/api/primbon/rejeki_hoki_weton?tgl=${tgl}&bln=${bln}&thn=${thn}`
  const res = await axios.get(apiUrl)
  return res.data
}

export default {
  command: ['weton', 'rejekiweton', 'hokiweton'],
  tag: 'fun',
  description: 'Cek rejeki & hoki berdasarkan weton (Primbon).',
  public: true,
  cooldown: 5000,
  coin: 5,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('📅 Masukkan tanggal lahir!\n\nContoh: `.weton 1 1 2025` (tgl bln thn)')
    }

    const [tgl, bln, thn] = text.split(' ')
    if (!tgl || !bln || !thn) {
      return m.reply('⚠️ Format salah!\nGunakan: `.weton 1 1 2025`')
    }

    try {
      const result = await cekWeton(tgl, bln, thn)

      if (!result.status || !result.data) {
        return m.reply('❌ Data weton tidak ditemukan.')
      }

      const data = result.data
      const message = `
🔮 *Rejeki & Hoki Weton*
📅 Hari Lahir: *${data.hari_lahir}*

💫 *Rejeki / Hoki*:  
${data.rejeki}

📝 *Catatan*:  
_${data.catatan}_
`.trim()

      await criv.sendMessage(m.chat, { text: message }, { quoted: m })

    } catch (err) {
      console.error('Rejeki Weton error:', err)
      m.reply('❌ Terjadi kesalahan saat mengecek weton.')
    }
  }
}