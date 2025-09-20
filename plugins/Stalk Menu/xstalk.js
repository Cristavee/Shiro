import axios from 'axios';

export default {
  command: ['xstalk', 'twitterstalk'],
  tag: 'stalk',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        '❌ Masukkan username Twitter (X) yang ingin distalk.\n\nContoh: .xstalk username'
      );
    }

    try {
      const apiUrl = `https://api.siputzx.my.id/api/stalk/twitter?user=${encodeURIComponent(
        text
      )}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) {
        return m.reply(
          `⚠️ Maaf, akun Twitter (X) dengan username "${text}" tidak ditemukan atau terjadi kesalahan.`
        );
      }

      const userData = data.data;
      let message = `> Info Akun Twitter (X) untuk *@${userData.username}*:\n\n`;
      message += `> Nama: ${userData.name}\n`;
      message += `> Bio: ${userData.description || 'Tidak ada bio'}\n`;
      message += `> Terverifikasi: ${userData.verified ? 'Ya' : 'Tidak'}\n`;
      message += `> Lokasi: ${userData.location || 'Tidak ada'}\n`;
      message += `> Dibuat Pada: ${new Date(userData.created_at).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}\n`;
      message += `> Jumlah Tweet: ${userData.stats.tweets.toLocaleString()}\n`;
      message += `> Mengikuti: ${userData.stats.following.toLocaleString()}\n`;
      message += `> Pengikut: ${userData.stats.followers.toLocaleString()}\n`;
      message += `> Jumlah Likes: ${userData.stats.likes.toLocaleString()}\n`;

      if (userData.profile?.image) {
        await criv.sendMessage(
          m.chat,
          {
            image: { url: userData.profile.image },
            caption: message,
          },
          { quoted: m }
        );
      } else {
        await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      }
    } catch (err) {
      console.error('XStalk Error:', err);
      return m.reply(
        '❌ Terjadi kesalahan saat mengambil data akun Twitter (X). Mohon coba lagi nanti.'
      );
    }
  },
};