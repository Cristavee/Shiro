import axios from 'axios';

export default {
  command: ['kbbi', 'kamus'],
  tag: 'search',
  description: 'Mencari arti kata dalam KBBI.',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 3, 
  cooldown: 3000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Masukkan kata yang ingin dicari di KBBI.\n\nContoh: .kbbi sadrah');
    }

    try {
      const apiUrl = `https://api.siputzx.my.id/api/s/kbbi?q=${encodeURIComponent(text)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data || data.data.length === 0) {
        return m.reply(`Maaf, arti kata "${text}" tidak ditemukan di KBBI.`);
      }

      const result = data.data[0]; 
      let message = `Hasil KBBI untuk "*${result.title}*":\n\n`;

      result.means.forEach((mean, index) => {
  const cleaned = mean.replace(/^(?:a|adv|v|n|ki|kl|kp|kb|kt|num|p|pron|s|u|l|bd|ark)\s*/gi, '').trim();
  message += ` ${index + 1}. ${cleaned}\n`;
});

      await criv.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (err) {
      console.error(err);
      return m.reply('Terjadi kesalahan saat mencari di KBBI. Mohon coba lagi nanti.');
    }
  }
};
