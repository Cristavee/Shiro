import axios from 'axios';
import FormData from 'form-data';

async function uploadImage(buffer, filename) {
  const form = new FormData();
  form.append('files[]', buffer, { filename });

  const { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
  });

  if (data.files && data.files[0]) return data.files[0].url;
  throw new Error('Upload gagal');
}

async function searchAnime(url) {
  const apiUrl = `https://api.siputzx.my.id/api/tools/identify-anime?imageUrl=${encodeURIComponent(
    url
  )}`;
  const { data } = await axios.get(apiUrl);
  return data;
}

export default {
  command: ['identify', 'animeapa', 'whatanime'],
  tag: 'search',
  public: true,
  cooldown: 5000,
  coin: 15,

  async run(criv, { m }) {
    const quoted = m.quoted?.isMedia ? m.quoted : m.isMedia ? m : null;
    const mime = (quoted?.msg || quoted)?.mimetype || '';

    if (!/image/.test(mime)) {
      return criv.reply(m, '❌ Balas atau kirim gambar untuk mencari anime.');
    }

    try {
      const buffer = await criv.downloadMediaMessage(quoted);
      const url = await uploadImage(buffer, 'anime.jpg');
      const result = await searchAnime(url);

      if (!result.status || !result.data) {
        return criv.reply(m, '❌ Anime tidak ditemukan.');
      }

      const data = result.data;
      const references = (data.references || [])
        .map((r) => `🌐 ${r.site}: ${r.url}`)
        .join('\n') || '-';

      const synopsis = await criv.translate(data.synopsis || '-');
      const description = await criv.translate(data.description || '-');

      const message = `
🎬 *Hasil Identifikasi Anime*
> *Anime*: ${data.anime}
> *Karakter*: ${data.character}
> *Genre*: ${data.genres}
> *Tayang Perdana*: ${data.premiere}
> *Studio*: ${data.production}

📝 *Deskripsi*:
${description}

📖 *Sinopsis*:
${synopsis}

🔗 *Referensi*:
${references}
`.trim();

      await criv.sendImage(m.chat, data.image, message, m);
    } catch (err) {
      console.error('Identify Anime error:', err);
      criv.reply(m, '❌ Gagal mengidentifikasi anime.');
    }
  },
};