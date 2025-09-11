import axios from 'axios';

export default {
  command: ['ig', 'igdl'],
  tag: 'download',
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, args }) {
    const url = args[0];
    if (!url || !url.includes('instagram.com')) {
      return criv.reply(m, 'Masukkan URL Instagram yang valid.');
    }

    try {
      const res = await axios.get(
        `https://apidl.asepharyana.tech/api/downloader/igdl?url=${encodeURIComponent(url)}`
      );
      const json = res.data;

      if (!json.status || !json.data?.length) {
        return criv.reply(m, 'Gagal mengunduh video dari Instagram.');
      }

      const video = json.data[0];
      await criv.sendVideo(m.chat, video.url, 'Hasil unduh', m);

    } catch (err) {
      console.error(err);
      criv.reply(m, 'Gagal mengunduh video dari Instagram.');
    }
  }
};