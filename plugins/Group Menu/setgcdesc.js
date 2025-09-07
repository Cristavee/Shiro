export default {
  command: ['setdescgc', 'gcdesc'],
  tag: 'group',
  description: 'Mengganti deskripsi grup.',
  owner: false,
  admin: true,
  botAdmin: true,
  public: false,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(msg.query);
    }

    try {
      await criv.groupUpdateDescription(m.chat, text);
      await m.reply('Deskripsi grup berhasil diubah.');
    } catch (error) {
      console.error('Error changing group description:', error);
      await m.reply('Gagal mengubah deskripsi grup. Pastikan saya admin grup.');
    }
  }
};