import axios from "axios"
import fs from "fs"
import path from "path"

export default {
  command: ["obfuscate", 'enc', 'obfus', 'encrypt'],
  tag: "utility",
  description: "Obfuscate code dari file",
  public: true,
  coin: 30,

  async run(criv, { m, text }) {
    try {
      let fileMessage = m.quoted
      if (!fileMessage || !fileMessage.message?.documentMessage) {
        return criv.reply(m, "📌 Reply file `.js` dengan caption *.obfuscate*")
      }
      const buffer = await criv.downloadMediaMessage(fileMessage)
      const originalCode = buffer.toString("utf-8")

      const apiUrl = `https://apis.davidcyriltech.my.id/obfuscate?level=high`
      const res = await axios.get(apiUrl, {
        params: { code: originalCode },
      })

      if (!res.data.success) {
        return criv.reply(m, "❌ Gagal meng-obfuscate kode")
      }

      const obfuscated = res.data.result.obfuscated_code.code
      const filePath = path.join(process.cwd(), "obfuscated.js")
      fs.writeFileSync(filePath, obfuscated)

      await criv.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(filePath),
          mimetype: "application/javascript",
          fileName: "obfuscated.js",
          caption: "✅ *Kode berhasil di-obfuscate!*",
        },
        { quoted: m }
      )

      fs.unlinkSync(filePath)
    } catch (err) {
      console.error(err)
      criv.reply(m, "⚠️ Terjadi kesalahan saat proses obfuscate.\nMungkin ukuran file terlalu besar")
    }
  },
}