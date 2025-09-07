import axios from 'axios';

export default {
  command: ['ttstalk', 'tiktokstalk'],
  tag: 'search',
  description: 'Melihat informasi detail akun TikTok.',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Masukkan username TikTok yang ingin distalk.\n\nContoh: .ttstalk cristavee');
    }

    try {
      const apiUrl = `https://api.vreden.my.id/api/tiktokStalk?query=${encodeURIComponent(text)}`;
      const { data } = await axios.get(apiUrl);

      if (data.status !== 200 || !data.result || !data.result.user) {
        return m.reply(`Maaf, akun TikTok dengan username "${text}" tidak ditemukan atau terjadi kesalahan.`);
      }

      const userData = data.result.user;
      const userStats = data.result.stats;

      let message = `> Info Akun TikTok untuk *@${userData.uniqueId}*:\n\n`;
      message += `> Nama: ${userData.nickname}\n`;
      message += `> Bio: ${userData.signature || 'Tidak ada bio'}\n`;
      message += `> Verified: ${userData.verified ? 'Ya' : 'Tidak'}\n`;
      message += `> Pengikut: ${userStats.followerCount.toLocaleString()}\n`;
      message += `> Mengikuti: ${userStats.followingCount.toLocaleString()}\n`;
      message += `> Suka (total): ${userStats.heartCount.toLocaleString()}\n`;
      message += `> Jumlah Video: ${userStats.videoCount.toLocaleString()}\n`;

     
      if (data.result.image) {
        await criv.sendMessage(m.chat, {
          image: { url: data.result.image },
          caption: message
        }, { quoted: m });
      } else if (userData.avatarLarger) {
         
          await criv.sendMessage(m.chat, {
              image: { url: userData.avatarLarger },
              caption: message
          }, { quoted: m });
      } else {
          
          await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      }


    } catch (err) {
      console.error(err);
      return m.reply('Terjadi kesalahan saat mengambil data akun TikTok. Mohon coba lagi nanti.');
    }
  }
};
