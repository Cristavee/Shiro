import axios from 'axios';

export default {
  command: ['shortlink', 'bitly'],
  tag: 'utility',
  coin: 10,
  async run(criv, { m, text }) {
    if (!text) return m.reply('Masukkan URL!\nContoh: .shortlink https://google.com');

    if (!/^https?:\/\//.test(text)) return m.reply('⚠️ URL harus diawali http:// atau https://');

    try {
      const { data } = await axios.get(`https://api.vreden.my.id/api/v1/tools/shortlink?url=${text}&type=bitly`);

      if (!data?.status || !data.result) return m.reply('❌ Gagal membuat shortlink.');

      const short = data.result;
      await criv.sendMessage(m.chat, {
        text: `✅ Shortlink:\n${short}`,
        interactiveButtons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: 'Copy URL',
              id: short,
              copy_code: short,
            }),
          },
        ],
      });
    } catch {
      m.reply('❌ Error, coba lagi nanti.');
    }
  },
};