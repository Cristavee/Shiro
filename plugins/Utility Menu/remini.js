import axios from 'axios';
import FormData from 'form-data';

export default {
  command: ['remini', 'hd', 'upscale'],
  tag: 'utility',
  public: true,
  cooldown: 5000,
  coin: 10,

  async run(criv, { m, args }) {
    const scale = parseInt(args[0]) || 4;
    if (![2, 3, 4].includes(scale)) {
      return criv.reply(m, '⚠️ Gunakan skala 2, 3, atau 4\nContoh: *.hd 4*');
    }

    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted)?.mimetype || '';
    if (!/image/.test(mime)) {
      return criv.reply(m, '📸 Balas gambar atau kirim gambar dengan caption *.hd 4*');
    }

    try {
      const buffer = await criv.downloadMediaMessage(quoted);

      const form = new FormData();
      form.append('image', buffer, { filename: 'image.jpg', contentType: mime });
      form.append('scale', scale);

      const { data } = await axios.post(
        'https://api.siputzx.my.id/api/iloveimg/upscale',
        form,
        {
          headers: form.getHeaders(),
          responseType: 'arraybuffer'
        }
      );

      await criv.sendImage(m.chat, Buffer.from(data), `✨ Gambar ditingkatkan x${scale}`, m);
    } catch (err) {
      console.error('Upscale error:', err);
      criv.reply(m, '❌ Upscale gagal. Coba lagi nanti.');
    }
  }
};