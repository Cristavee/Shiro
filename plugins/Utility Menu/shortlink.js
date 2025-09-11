import axios from 'axios';

export default {
  command: ['shortlink', 'bitly'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 3000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        'Masukkan URL yang ingin dipendekkan.\n\nContoh: .shortlink https://www.google.com'
      );
    }

    if (!text.startsWith('http://') && !text.startsWith('https://')) {
      return m.reply(
        '⚠️ Mohon masukkan URL yang valid (diawali dengan http:// atau https://).'
      );
    }

    try {
      const apiUrl = `https://api.vreden.my.id/api/tools/shortlink/bitly?url=${encodeURIComponent(
        text
      )}`;
      const { data } = await axios.get(apiUrl);

      if (data.status !== 200 || !data.result) {
        return m.reply(
          '❌ Gagal membuat shortlink. Coba lagi nanti atau pastikan URL benar.'
        );
      }

      const shortLink = data.result;
      const message = `✅ Shortlink berhasil dibuat:\n${shortLink}`;

      await criv.sendMessage(m.chat, {
        text: message,
        interactiveButtons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: 'Copy URL',
              id: shortLink,
              copy_code: shortLink,
            }),
          },
        ],
      });
    } catch (err) {
      console.error('Shortlink error:', err);
      return m.reply(
        '❌ Terjadi kesalahan saat memproses shortlink. Mohon coba lagi nanti.'
      );
    }
  },
};