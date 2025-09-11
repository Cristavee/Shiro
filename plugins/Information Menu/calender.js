import axios from "axios";

export default {
  command: ['calendar', 'kalender', 'calender'],
  tag: 'information',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 10,
  cooldown: 3000,

  async run(criv, { m, text }) {
    try {
      const [month, year] = text.split(" ");

      if (!month || !year) {
        return m.reply("Format salah!\n\nContoh: .calendar 12 2025");
      }

      const url = `https://apidl.asepharyana.tech/api/image/calendar?month=${month}&year=${year}`;
      const response = await axios.get(url, { responseType: "arraybuffer" });

      await criv.sendImage(m.chat, response.data, m, {
        caption: `📅 Kalender bulan *${month}* tahun *${year}*`
      });
    } catch (e) {
      console.error("[ERROR] Gagal mengambil kalender:", e);
      m.reply("⚠️ Gagal mengambil kalender!");
    }
  }
};