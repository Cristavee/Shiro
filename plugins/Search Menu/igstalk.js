import axios from 'axios';
  export default {
  command: ['igstalk', 'instagramstalk'],
  tag: 'search',
owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {
    if (!text) {
      return m.reply(msg.query);
    }
      try {
      const apiUrl = `https://api.vreden.my.id/api/igstalk?query=${encodeURIComponent(text)}`;
      const { data } = await axios.get(apiUrl);
        if (data.status !== 200 || !data.result || !data.result.user) {
        return m.reply(`Maaf, akun Instagram dengan username "${text}" tidak ditemukan atau terjadi kesalahan.`);
      }
        const userData = data.result.user;
        let message = `> Info Akun Instagram untuk *@${userData.username}*:\n\n`;
      message += `> Nama Lengkap: ${userData.full_name}\n`;
      message += `> Bio: ${userData.biography || 'Tidak ada bio'}\n`;
      message += `> Kategori: ${userData.category || 'Tidak ditentukan'}\n`;
      message += `> Akun Bisnis: ${userData.is_business ? 'Ya' : 'Tidak'}\n`;
      message += `> Akun Pribadi (Private): ${userData.is_private ? 'Ya' : 'Tidak'}\n`;
      message += `> Terverifikasi: ${userData.is_verified ? 'Ya' : 'Tidak'}\n`;
      message += `> Pengikut: ${userData.follower_count.toLocaleString()}\n`;
      message += `> Mengikuti: ${userData.following_count.toLocaleString()}\n`;
      message += `> Jumlah Postingan: ${userData.media_count.toLocaleString()}\n`;
      
      if (userData.external_url) {
        message += `> Link Bio: ${userData.external_url}\n`;
      }
        const profilePicUrl = data.result.image || userData.hd_profile_pic_url_info?.url || userData.profile_pic_url_hd;
        if (profilePicUrl) {
        await criv.sendMessage(m.chat, {
          image: { url: profilePicUrl },
          caption: message
        }, { quoted: m });
      } else {
        await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      }
      } catch (err) {
      console.error(err);
      return m.reply('Terjadi kesalahan saat mengambil data akun Instagram. Mohon coba lagi nanti.');
    }
  }
};
