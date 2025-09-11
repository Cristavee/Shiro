import axios from 'axios';

export default {
  command: ['tiktoksearch', 'tsearch'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        '❌ Masukkan kata kunci untuk mencari video TikTok.\nContoh: .tiktoksearch phonk'
      );
    }

    try {
      const apiUrl = `https://api.diioffc.web.id/api/search/tiktok?query=${encodeURIComponent(
        text
      )}`;
      const { data } = await axios.get(apiUrl);

      const results = data?.result;
      if (!Array.isArray(results) || results.length === 0) {
        return m.reply(
          `❌ Video TikTok untuk "${text}" tidak ditemukan. Coba kata kunci lain.`
        );
      }

      const firstResult = results[0];
      let message = `> Hasil Pencarian TikTok untuk "${text}":\n\n`;
      message += `> Judul: ${firstResult.title}\n`;
      message += `> Author: ${firstResult.author.name} (@${firstResult.author.username})\n`;
      message += `> Durasi: ${firstResult.duration} detik\n`;
      message += `> Views: ${firstResult.stats.play}\n`;
      message += `> Likes: ${firstResult.stats.like}\n`;
      message += `> Komentar: ${firstResult.stats.comment}\n`;
      message += `> Link Musik: ${firstResult.music.play || 'Tidak tersedia'}\n`;
      message += `> Download No WM: ${firstResult.media.no_watermark || 'Tidak tersedia'}\n`;
      message += `> ID Video: ${firstResult.video_id}`;

      await criv.sendMessage(
        m.chat,
        {
          image: { url: firstResult.thumbnail },
          caption: message
        },
        { quoted: m }
      );
    } catch (err) {
      console.error('TikTok Search Error:', err);
      return m.reply(
        '❌ Terjadi kesalahan saat mencari video TikTok. Mohon coba lagi nanti.'
      );
    }
  }
};