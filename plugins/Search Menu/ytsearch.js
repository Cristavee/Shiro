import yts from 'yt-search';

export default {
  command: ['yts', 'ytsearch', 'ytlist'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 15,
  cooldown: 7000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('❓ Masukkan kata kunci untuk mencari video YouTube.');

    try {
      const search = await yts(text);
      const results = search.videos.slice(0, 10);

      if (!results.length) {
        return m.reply(`❌ Tidak ada hasil untuk: *${text}*`);
      }

      let list = `🔎 *Hasil Pencarian YouTube untuk:* _${text}_\n\n`;
      results.forEach((vid, i) => {
        list += `*${i + 1}. ${vid.title}*\n`;
        list += `> 📺 Channel: ${vid.author.name}\n`;
        list += `> ⏱ Durasi: ${vid.timestamp}\n`;
        list += `> 🔗 Tonton -> ${vid.url}\n\n`;
      });

      await criv.sendMessage(
        m.chat,
        {
          image: { url: results[0].thumbnail },
          caption: list.trim(),
        },
        { quoted: m }
      );
    } catch (err) {
      console.error('YT Search error:', err);
      m.reply('❌ Terjadi kesalahan saat mencari video di YouTube.');
    }
  },
};