import axios from 'axios'

export default {
  command: ['gsm', 'gsmarena'],
  tag: 'search',
  coin: 10,
  public: true,
  premium: false,
  cooldown: 5000,
  async run(criv, { m, text, args, readMore }) {
    if (!text) return m.reply(global.msg.query)

    try {
      const query = encodeURIComponent(args.join(' '))
      const { data } = await axios.get(`https://zenz.biz.id/search/gsmarena?phone=${query}`)
      if (!data?.status || !data.result) return m.reply('Data tidak ditemukan')

      const p = data.result
      const s = p.specs

      const teks = `
*${p.phoneName}*

Harga:
> ${p.prices?.EUR || '-'}

Jaringan:
> Teknologi: ${s?.Network?.Technology || '-'}
> 2G       : ${s?.Network?.['2G bands'] || '-'}
> 3G       : ${s?.Network?.['3G bands'] || '-'}
> 4G       : ${s?.Network?.['4G bands'] || '-'}
> 5G       : ${s?.Network?.['5G bands'] || '-'}
> Speed    : ${s?.Network?.Speed || '-'}

Rilis:
> Diumumkan : ${s?.Launch?.Announced || '-'}
> Status    : ${s?.Launch?.Status || '-'}

Body:
> Dimensi : ${s?.Body?.Dimensions || '-'}
> Berat   : ${s?.Body?.Weight || '-'}
> SIM     : ${s?.Body?.SIM || '-'}

Layar:
> Tipe     : ${s?.Display?.Type || '-'}
> Ukuran   : ${s?.Display?.Size || '-'}
> Resolusi : ${s?.Display?.Resolution || '-'}
> Proteksi : ${s?.Display?.Protection || '-'}

Platform:
> OS      : ${s?.Platform?.OS || '-'}
> Chipset : ${s?.Platform?.Chipset || '-'}
> CPU     : ${s?.Platform?.CPU || '-'}
> GPU     : ${s?.Platform?.GPU || '-'}

Memori:
> Internal : ${s?.Memory?.Internal || '-'}
> Eksternal: ${s?.Memory?.['Card slot'] || '-'}

Kamera Utama:
> Triple : ${s?.['Main Camera']?.Triple || '-'}
> Fitur  : ${s?.['Main Camera']?.Features || '-'}
> Video  : ${s?.['Main Camera']?.Video || '-'}

Kamera Depan:
> Single : ${s?.['Selfie camera']?.Single || '-'}
> Fitur  : ${s?.['Selfie camera']?.Features || '-'}
> Video  : ${s?.['Selfie camera']?.Video || '-'}

Suara:
> Speaker   : ${s?.Sound?.Loudspeaker || '-'}
> Jack 3.5mm: ${s?.Sound?.['3.5mm jack'] || '-'}

Konektivitas:
> WLAN     : ${s?.Comms?.WLAN || '-'}
> Bluetooth: ${s?.Comms?.Bluetooth || '-'}
> GPS      : ${s?.Comms?.Positioning || '-'}
> NFC      : ${s?.Comms?.NFC || '-'}
> Radio    : ${s?.Comms?.Radio || '-'}
> USB      : ${s?.Comms?.USB || '-'}

Baterai:
> Tipe     : ${s?.Battery?.Type || '-'}
> Charging : ${s?.Battery?.Charging || '-'}

Lainnya:
> Warna    : ${s?.Misc?.Colors || '-'}
> Model    : ${s?.Misc?.Models || '-'}
> SAR      : ${s?.Misc?.SAR || '-'}
> SAR EU   : ${s?.Misc?.['SAR EU'] || '-'}

Pengujian:
> Performa : ${s?.['Our Tests']?.Performance?.toLocaleString() || '-'}
> Layar    : ${s?.['Our Tests']?.Display || '-'}
> Speaker  : ${s?.['Our Tests']?.Loudspeaker || '-'}
> Baterai  : ${s?.['Our Tests']?.Battery || '-'}

Label EU:
> Energi        : ${s?.['EU LABEL']?.Energy || '-'}
> Ketahanan Batt: ${s?.['EU LABEL']?.Battery || '-'}
> Jatuh Bebas   : ${s?.['EU LABEL']?.['Free fall'] || '-'}
> Perbaikan     : ${s?.['EU LABEL']?.Repairability || '-'}
      `.trim()

      await criv.sendMessage(m.chat, { image: { url: p.imageUrl }, caption: teks, ai: true }, { quoted: m })

    } catch (err) {
      console.error('GsmArena error:', err)
      m.reply(global.msg.error)
    }
  }
}