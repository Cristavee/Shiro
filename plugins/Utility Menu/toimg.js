import fs from "fs"
import { exec } from "child_process"
import path from "path"

function rand(ext) {
  return path.join(process.cwd(), `${Math.floor(Math.random() * 10000)}${ext}`)
}

export default {
  command: ["toimage", "toimg"],
  tag: "utility",
  public: true,
  coin: 10,

  async run(criv, { m }) {
    try {
      const q = m.quoted || m
      const mime = q?.mimetype || ""

      if (!/webp/.test(mime)) {
        return m.reply(`❌ Reply a sticker with command: .toimage`)
      }

      const media = await q.download()
      if (!media) return m.reply("❌ Failed to download sticker")

      const inp = rand(".webp")
      const out = rand(".png")
      fs.writeFileSync(inp, media)

      exec(`ffmpeg -i ${inp} ${out}`, async (err) => {
        fs.unlinkSync(inp)
        if (err) {
          console.error("FFmpeg error:", err)
          return m.reply("❌ Failed to convert sticker")
        }

        const buffer = fs.readFileSync(out)
        await criv.sendImage(m.chat, buffer)
        fs.unlinkSync(out)
      })
    } catch (e) {
      m.reply(`❌ Error: ${e.message}`)
    }
  }
}