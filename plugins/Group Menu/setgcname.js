export default {
  command: ['setgrupname', 'gcname'],
  tag: 'group',
owner: false,
  admin: true,
  botAdmin: true,
  group: true,
  public: false,
  premium: false,
  coin: 10,
  cooldown: 5000,
    async run(criv, { m, text }) {
    if (!text) {
      return m.reply(msg.query);
    }
      try {
      await criv.groupUpdateSubject(m.chat, text);
      await m.reply(`Nama grup berhasil diubah menjadi: *${text}*`);
    } catch (error) {
      console.error('Error changing group name:', error);
      await m.reply('Gagal mengubah nama grup. Pastikan saya admin grup.');
    }
  }
};