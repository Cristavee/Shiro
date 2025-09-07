import axios from "axios"

export default {
  command: ["jadwal", "jadwalsholat", "sholat"],
  tag: "information",
  description: "Cek jadwal sholat harian berdasarkan kota",
  public: true,

  async run(criv, { m, args }) {
    const kota = args.join(" ")
    if (!kota) return criv.reply(m, "📌 Contoh: .jadwal jakarta")

    try {
      const url = `https://apidl.asepharyana.tech/api/search/jadwal-sholat?kota=${encodeURIComponent(kota)}`
      const res = await axios.get(url)

      if (!res.data || !res.data.schedules || res.data.schedules.length === 0) {
        return criv.reply(m, "❌ Jadwal sholat tidak ditemukan!")
      }

      const d = res.data.schedules[0]
      const j = d.jadwal

      const teks = `
🕌 *Jadwal Sholat* (${d.lokasi}, ${d.daerah})
📅 ${j.tanggal}

🌙 Imsak : ${j.imsak}
🕓 Subuh : ${j.subuh}
🌅 Terbit : ${j.terbit}
🌞 Dhuha : ${j.dhuha}
🏙️ Dzuhur : ${j.dzuhur}
🌇 Ashar : ${j.ashar}
🌆 Maghrib : ${j.maghrib}
🌃 Isya : ${j.isya}
      `.trim()

      await criv.reply(m, teks)
    } catch (e) {
      console.error(e)
      criv.reply(m, "⚠️ Gagal mengambil jadwal, coba lagi nanti.")
    }
  },
}