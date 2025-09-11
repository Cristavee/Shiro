import axios from 'axios';

export default {
  command: ['threadsstalk', 'thread'],
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
      return m.reply(
        '❌ Masukkan username Threads yang ingin dicari.\nContoh: .threadsstalk google'
      );
    }

    try {
      const apiUrl = `https://api.siputzx.my.id/api/stalk/threads?q=${encodeURIComponent(
        text
      )}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) {
        return m.reply(
          `❌ Akun Threads dengan username "${text}" tidak ditemukan atau terjadi kesalahan.`
        );
      }

      const userData = data.data;
      let message = `> Info Akun Threads untuk *@${userData.username}*:\n\n`;
      message += `> Nama: ${userData.name}\n`;
      message += `> Bio: ${userData.bio || 'Tidak ada bio'}\n`;
      message += `> Terverifikasi: ${userData.is_verified ? 'Ya' : 'Tidak'}\n`;
      message += `> Followers: ${userData.followers.toLocaleString()}\n`;

      if (userData.links && userData.links.length > 0) {
        message += `> Link Terkait: ${userData.links.join(', ')}\n`;
      }

      const profilePicUrl = userData.hd_profile_picture || userData.profile_picture;

      if (profilePicUrl) {
        await criv.sendMessage(
          m.chat,
          {
            image: { url: profilePicUrl },
            caption: message
          },
          { quoted: m }
        );
      } else {
        await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      }
    } catch (err) {
      console.error('Threads Stalk Error:', err);
      return m.reply(
        '❌ Terjadi kesalahan saat mengambil data akun Threads. Silakan coba lagi nanti.'
      );
    }
  }
};