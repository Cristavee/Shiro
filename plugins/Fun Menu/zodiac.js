import axios from 'axios'

async function getZodiak(zodiak) {
  const apiUrl = `https://api.siputzx.my.id/api/primbon/zodiak?zodiak=${encodeURIComponent(zodiak)}`
  const res = await axios.get(apiUrl)
  return res.data
}

export default {
  command: ['zodiak', 'ramalanzodiak', 'horoskop'],
  tag: 'fun',
  public: true,
  cooldown: 5000,
  coin: 8,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('♈ Contoh penggunaan:\n\n`.zodiak gemini`')
    }

    try {
      const result = await getZodiak(text.toLowerCase())
      if (!result.status || !result.data) {
        return m.reply('❌ Zodiak tidak ditemukan atau salah penulisan.')
      }

      const d = result.data
      const message = `
🔮 *Ramalan Zodiak Primbon*

✨ Zodiak: *${d.zodiak}*

🍀 Nomor Keberuntungan:
> ${d.nomor_keberuntungan}

🌸 Aroma Keberuntungan:
> ${d.aroma_keberuntungan}

🪐 Planet Mengitari:
> ${d.planet_yang_mengitari}

🌼 Bunga Keberuntungan:
> ${d.bunga_keberuntungan}

🎨 Warna Keberuntungan:
> ${d.warna_keberuntungan}

💎 Batu Keberuntungan:
> ${d.batu_keberuntungan}

🌬️ Elemen Keberuntungan:
> ${d.elemen_keberuntungan}

💞 Pasangan Zodiak Cocok:
> ${d.pasangan_zodiak}
      `.trim()

      await criv.sendMessage(m.chat, { text: message }, { quoted: m })
    } catch (err) {
      console.error('Zodiak error:', err)
      m.reply('❌ Terjadi kesalahan saat mengambil data zodiak.')
    }
  }
}