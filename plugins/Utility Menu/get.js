import axios from 'axios';
import path from 'path';
import mime from 'mime-types';

export default {
  command: ['get'],
  tag: 'utility',
  description: 'Mengambil isi dari halaman URL menggunakan metode GET.',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('> Silakan masukkan URL yang ingin diambil.');

    const isValidUrl = /^(http|https):\/\/[^ "]+$/.test(text);
    if (!isValidUrl) return m.reply('> Masukkan URL yang valid dan diawali dengan http:// atau https://');

    try {
      const res = await axios.get(text, { responseType: 'arraybuffer' });

      const contentType = res.headers['content-type'] || '';
      const buffer = Buffer.from(res.data);
      if (contentType.includes('text') || contentType.includes('json') || contentType.includes('xml')) {
        let content = buffer.toString('utf-8');

        if (contentType.includes('json')) {
          try {
            const parsed = JSON.parse(content);
            content = JSON.stringify(parsed, null, 2);
          } catch (e) {
            content = content;
          }
        }

        if (content.length > 4000) {
          content = content.slice(0, 4000) + '\n\n> ...(dipotong)';
        }

        return await m.reply(`GET dari ${text}:\n\n${content}`);
      }

      const ext = mime.extension(contentType) || 'bin';
      const filename = `get-result.${ext}`;

      await criv.sendFile(m.chat, buffer, filename, null, m);

    } catch (err) {
      console.error('Gagal mengambil URL:', err);
      await m.reply('> Gagal mengambil isi URL. Periksa URL atau coba lagi nanti.');
    }
  }
};