import axios from "axios"

export default {
  command: ["ip", "ipinfo", "iplocation", "iploc"],
  tag: "utility",
  public: true,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, args }) {
    const ip = args[0]
    if (!ip) return criv.reply(m, "📌 Contoh: .ipinfo 123.4.567.89")

    try {
      const url = `https://apidl.asepharyana.tech/api/tool/v2/iplocation?ip=${encodeURIComponent(ip)}`
      const res = await axios.get(url)

      if (!res.data || !res.data.ipInfo) {
        return criv.reply(m, "❌ Data tidak ditemukan!")
      }

      const d = res.data.ipInfo
      const teks = `
🌐 *Informasi IP*
  🔹 IP: ${d.ip}
🏙️ Kota: ${d.city}
🌍 Region: ${d.region}
🏳️ Negara: ${d.country}
📍 Lokasi (lat,long): ${d.loc}
🏢 Provider / ISP: ${d.org}
🏤 Kode Pos: ${d.postal}
🕒 Zona Waktu: ${d.timezone}
      `.trim()

      await criv.reply(m, teks)

    } catch (e) {
      console.error('IP Info error:', e)
      criv.reply(m, "⚠️ Gagal mengambil data, coba lagi nanti.")
    }
  },
}