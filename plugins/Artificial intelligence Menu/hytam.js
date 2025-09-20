import axios from "axios"
import FormData from "form-data"

const list = ["hitam", "coklat", "nerd", "piggy", "carbon", "botak"]

async function up(buf) {
  const f = new FormData()
  f.append("files[]", buf, { filename: "img.jpg", contentType: "image/jpeg" })
  const r = await axios.post("https://uguu.se/upload.php", f, { headers: f.getHeaders() })
  return r.data?.files?.[0]?.url
}

export default {
  command: ["hitam", "ireng", "gelapkan", "kumar"],
  tag: "ai",
  public: true,
  coin: 30,
  cooldown: 8000,

  async run(criv, { m, text }) {
    try {
      let f = (text || "hitam").toLowerCase()
      if (f === "list") return criv.reply(m, `📌 Filter:\n- ${list.join("\n- ")}`)
      if (!list.includes(f)) f = "hitam"

      let url = text?.startsWith("http") ? text : null
      if (!url) {
        const q = m.quoted?.isMedia ? m.quoted : m.isMedia ? m : null
        if (!q) return criv.reply(m, "📸 Kirim/reply gambar atau pakai URL.\n gunakan .hitam list untuk melihat list")
        const buf = await q.download()
        if (!buf) return criv.reply(m, "❌ Gagal unduh gambar.")
        url = await up(buf)
      }

      const api = `https://apidl.asepharyana.tech/api/ai/negro?url=${encodeURIComponent(url)}&filter=${f}`
      const r = await axios.get(api, { responseType: "arraybuffer", timeout: 20000 })
      const img = Buffer.from(r.data)

      await criv.sendImage(m.chat, img, `Gambar *di${f}in*`, m)
    } catch (e) {
      console.error("hitam error:", e)
      criv.reply(m, "❌ Error: " + (e.message || ""))
    }
  }
}