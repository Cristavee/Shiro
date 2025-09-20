import axios from 'axios';

export default {
  command: ['ytstalk', 'youtubestalk'],
  tag: 'stalk',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(
      'Masukkan username channel YouTube yang ingin distalk.\n\nContoh: .ytstalk MrBeast'
    );

    try {
      const apiUrl = `https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(text)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data?.channel) {
        return m.reply(`Maaf, channel YouTube dengan username "${text}" tidak ditemukan atau terjadi kesalahan.`);
      }

      const channel = data.data.channel;
      const latestVideos = data.data.latest_videos;

      // Info channel
      let channelMessage = `> Info Channel YouTube untuk *${channel.username}*:\n\n`;
      channelMessage += `> Nama Channel: ${channel.username}\n`;
      channelMessage += `> Subscriber: ${channel.subscriberCount}\n`;
      channelMessage += `> Jumlah Video: ${channel.videoCount}\n`;
      channelMessage += `> Deskripsi: ${channel.description || 'Tidak ada deskripsi'}\n`;
      channelMessage += `> Link Channel: ${channel.channelUrl}\n`;

      if (channel.avatarUrl) {
        await criv.sendMessage(m.chat, {
          image: { url: channel.avatarUrl },
          caption: channelMessage
        }, { quoted: m });
      } else {
        await criv.sendMessage(m.chat, { text: channelMessage }, { quoted: m });
      }

      // Video terbaru
      if (latestVideos?.length) {
        let videosMessage = `\n> *Video Terbaru dari ${channel.username}:*\n\n`;
        latestVideos.slice(0, 5).forEach((video, idx) => {
          videosMessage += `> ${idx + 1}. Judul: ${video.title}\n`;
          videosMessage += `>    Durasi: ${video.duration}\n`;
          videosMessage += `>    Views: ${video.viewCount}\n`;
          videosMessage += `>    Dipublikasikan: ${video.publishedTime}\n`;
          videosMessage += `>    Link: ${video.videoUrl}\n\n`;
        });
        await criv.sendMessage(m.chat, { text: videosMessage }, { quoted: m });
      } else {
        await criv.sendMessage(m.chat, {
          text: `> Tidak ada video terbaru yang ditemukan untuk channel ${channel.username}.`
        }, { quoted: m });
      }

    } catch (err) {
      console.error('YT Stalk error:', err);
      return m.reply('Terjadi kesalahan saat mengambil data channel YouTube. Mohon coba lagi nanti.');
    }
  }
};