import fetch from "node-fetch"
  export default {
  command: ["iqc"],
  tag: "utility",
async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        "❌ Format salah!\nGunakan: .iqc jam|batre|pesan\nContoh: .iqc 18:00|40|hai hai"
      )
    }
      let [time, battery, ...msg] = text.split("|")
    if (!time || !battery || msg.length === 0) {
      return m.reply(
        "❌ Format salah!\nGunakan: .iqc jam|batre|pesan\nContoh: .iqc 18:00|40|hai hai"
      )
    }
      let messageText = encodeURIComponent(msg.join("|").trim())
    let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
      time
    )}&batteryPercentage=${battery}&carrierName=INDOSAT%20OOREDOO&messageText=${messageText}&emojiStyle=apple`
      try {
      let res = await fetch(url)
      if (!res.ok) throw new Error("Gagal fetch URL")
        let buffer = await res.buffer()
      await criv.sendMessage(
        m.chat,
        { image: buffer, caption: "✅ Berhasil dibuat!" },
        { quoted: m }
      )
    } catch (err) {
      console.error("IQC Error:", err)
      m.reply("❌ Gagal membuat quote, coba lagi nanti.")
    }
  },
}