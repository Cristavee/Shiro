import axios from 'axios';

export default {
  command: ['wiki', 'wikipedia'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 15,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        '❌ Masukkan kata kunci untuk mencari di Wikipedia.\n\nContoh: .wiki bitcoin'
      );
    }

    try {
      const apiUrl = `https://api.siputzx.my.id/api/s/wikipedia?query=${encodeURIComponent(
        text
      )}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data || !data.data.wiki) {
        return m.reply(`⚠️ Tidak ditemukan informasi Wikipedia untuk "${text}".`);
      }

      const wikiData = data.data;
      let message = `> Hasil Pencarian Wikipedia untuk "*${text}*":\n\n`;
      message += `${wikiData.wiki.substring(0, 1500)}${
        wikiData.wiki.length > 1500 ? '...' : ''
      }\n`;

      if (wikiData.thumb) {
        await criv.sendMessage(
          m.chat,
          {
            image: { url: wikiData.thumb },
            caption: message,
          },
          { quoted: m }
        );
      } else {
        await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      }
    } catch (err) {
      console.error('Wikipedia Error:', err);
      return m.reply(
        '❌ Terjadi kesalahan saat mencari informasi di Wikipedia. Mohon coba lagi nanti.'
      );
    }
  },
};