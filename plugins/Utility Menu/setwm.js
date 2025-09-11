export default {
  command: ['setwm', 'swm', 'wm'],
  tag: 'utility',
  group: false,
  owner: false,
  admin: false,
  botAdmin: false,
  premium: false,
  coin: 10,
  cooldown: 3_000,

  async run(criv, { m, text }) {
    try {
      const [pn, ...athParts] = text?.split('|') || [];
      const ath = athParts.join('|');

      let buffer;
      if (m.quoted) {
        buffer = await m.quoted.download();
      } else if (/image/.test(m.mtype)) {
        buffer = await m.download();
      }

      if (!buffer) {
        return criv.reply(m, '> Balas stiker/foto atau kirim gambar untuk dijadikan stiker dengan watermark custom.');
      }

      const stickerBuffer = await criv.createExif(buffer, { 
        pn: pn || 'Sticker by ', 
        ath: ath || m.pushName   
      });

      await criv.sendFormattedMessage(m, { sticker: stickerBuffer }, { quoted: m });
    } catch (err) {
      console.error('[setwm error]', err);
      criv.reply(m, '> Gagal mengatur watermark stiker. Pastikan file valid dan bukan stiker animasi kompleks.');
    }
  }
};