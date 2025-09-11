import axios from "axios";

export default {
  command: ["iqc"],
  tag: "utility",
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        "❌ Format salah!\nContoh: .iqc Hai hai"
      );
    }

    const txt = encodeURIComponent(text.trim());

    // Generate random values untuk quote
    const randHour = Math.floor(Math.random() * 24).toString().padStart(2, "0");
    const randMinute = Math.floor(Math.random() * 60).toString().padStart(2, "0");
    const randBattery = Math.floor(Math.random() * 101);
    const randSignal = Math.floor(Math.random() * 5);
    const providers = ["INDOSAT OOREDOO", "TELKOMSEL", "XL Axiata", "AXIS"];
    const randProvider = providers[Math.floor(Math.random() * providers.length)];

    const url = `https://brat.siputzx.my.id/iphone-quoted?time=${randHour}:${randMinute}&batteryPercentage=${randBattery}&carrierName=${encodeURIComponent(randProvider)}&signalStrength=${randSignal}&messageText=${txt}&emojiStyle=apple`;

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      await criv.sendMessage(
        m.chat,
        { image: buffer },
        { quoted: m }
      );

    } catch (err) {
      console.error("IQC Error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Axios status:", err.response?.status);
        console.error("Axios data:", err.response?.data);
      }
      m.reply("❌ Gagal membuat quote, coba lagi nanti.");
    }
  },
};