import axios from "axios";

export default {
  command: ["obfuscate", "enc", "obfus", "encrypt"],
  tag: "utility",
  public: true,
  coin: 30,
  cooldown: 10000,

  async run(criv, { m }) {
    try {
      const fileMessage = m.quoted;
      if (!fileMessage || !fileMessage.message?.documentMessage) {
        return criv.reply(m, "📌 Reply file `.js` dengan caption *.obfuscate*");
      }

      const buffer = await criv.downloadMediaMessage(fileMessage);
      const originalCode = buffer.toString("utf-8");

      const apiUrl = `https://apis.davidcyriltech.my.id/obfuscate?level=high`;
      const res = await axios.get(apiUrl, { params: { code: originalCode } });

      if (!res.data || !res.data.success || !res.data.result?.obfuscated_code?.code) {
        return criv.reply(m, "❌ Gagal meng-obfuscate kode. Periksa kembali file JS Anda.");
      }

      const obfuscated = res.data.result.obfuscated_code.code;
      const obfuscatedBuffer = Buffer.from(obfuscated, "utf-8");

      await criv.sendMessage(
        m.chat,
        {
          document: obfuscatedBuffer,
          mimetype: "application/javascript",
          fileName: "obfuscated.js",
          caption: "✅ *Kode berhasil di-obfuscate!*",
        },
        { quoted: m }
      );

    } catch (err) {
      console.error("Obfuscate Error:", err);
      criv.reply(m, "⚠️ Terjadi kesalahan saat proses obfuscate. Ukuran file mungkin terlalu besar atau ada kesalahan format.");
    }
  },
};