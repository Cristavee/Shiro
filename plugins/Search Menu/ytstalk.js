import axios from 'axios';

export default {
  command: ['ytstalk', 'youtubestalk'],
  tag: 'search',
  description: 'Melihat informasi detail channel YouTube dan video terbaru.',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Masukkan username channel YouTube yang ingin distalk.\n\nContoh: .ytstalk MrBeast');
    }

    try {
      const apiUrl = `https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(text)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data || !data.data.channel) {
        return m.reply(`Maaf, channel YouTube dengan username "${text}" tidak ditemukan atau terjadi kesalahan.`);
      }

      const channelData = data.data.channel;
      const latestVideos = data.data.latest_videos;

      let channelMessage = `> Info Channel YouTube untuk *${channelData.username}*:\n\n`;
      channelMessage += `> Nama Channel: ${channelData.username}\n`;
      channelMessage += `> Subscriber: ${channelData.subscriberCount}\n`;
      channelMessage += `> Jumlah Video: ${channelData.videoCount}\n`;
      channelMessage += `> Deskripsi: ${channelData.description || 'Tidak ada deskripsi'}\n`;
      channelMessage += `> Link Channel: ${channelData.channelUrl}\n`;

      if (channelData.avatarUrl) {
        await criv.sendMessage(m.chat, {
          image: { url: channelData.avatarUrl },
          caption: channelMessage
        }, { quoted: m });
      } else {
        await criv.sendMessage(m.chat, { text: channelMessage }, { quoted: m });
      }

      if (latestVideos && latestVideos.length > 0) {
        let videosMessage = `\n> *Video Terbaru dari ${channelData.username}:*\n\n`;
        latestVideos.slice(0, 5).forEach((video, index) => { // Ambil 5 video terbaru
          videosMessage += `> ${index + 1}. Judul: ${video.title}\n`;
          videosMessage += `>    Durasi: ${video.duration}\n`;
          videosMessage += `>    Views: ${video.viewCount}\n`;
          videosMessage += `>    Dipublikasikan: ${video.publishedTime}\n`;
          videosMessage += `>    Link: ${video.videoUrl}\n\n`;
        });
        await criv.sendMessage(m.chat, { text: videosMessage }, { quoted: m });
      } else {
        await criv.sendMessage(m.chat, { text: `> Tidak ada video terbaru yang ditemukan untuk channel ${channelData.username}.` }, { quoted: m });
      }

    } catch (err) {
      console.error(err);
      return m.reply('Terjadi kesalahan saat mengambil data channel YouTube. Mohon coba lagi nanti.');
    }
  }
};
