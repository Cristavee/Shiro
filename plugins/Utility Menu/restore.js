import axios from 'axios';
import FormData from 'form-data';

async function up(buffer, filename) {
  const form = new FormData();
  form.append('files[]', buffer, { filename });
  const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
  });
  if (data.files && data.files[0]) return data.files[0].url;
  throw new Error('Upload gagal');
}

async function restore(url) {
  const apiUrl = `https://apidl.asepharyana.tech/api/ai/colorize?url=${encodeURIComponent(url)}`;
  const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
  if (!res.data) throw new Error('API gagal mengembalikan data');
  return Buffer.from(res.data);
}

export default {
  command: ['restore', 'colorize', 'warna'],
  tag: 'utility',
  public: true,
  cooldown: 5000,
  coin: 10,

  async run(criv, { m }) {
    const quoted = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null);
    const mime = (quoted?.msg || quoted)?.mimetype || '';
    if (!/image/.test(mime)) return criv.reply(m, '⚠️ Balas atau kirim gambar dengan caption *.restore*');

    try {
      const buffer = await criv.downloadMediaMessage(quoted);
      const url = await up(buffer, 'image.jpg');
      const hasil = await restore(url);

      await criv.sendImage(m.chat, hasil, '✅ Foto berhasil direstore', m);
    } catch (err) {
      console.error('Restore error:', err);
      criv.reply(m, '❌ Gagal me-restore gambar.');
    }
  }
};