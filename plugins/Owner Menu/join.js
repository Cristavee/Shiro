export default {
  command: ['join', 'gabung'],
  tag: 'owner', // Atau 'owner', karena ini fitur khusus owner
  description: 'Membuat bot bergabung ke grup melalui link undangan.',
  owner: true, // Hanya owner bot yang bisa menggunakan fitur ini
  admin: false,
  botAdmin: false,
  public: false,
  group: false, // Bisa digunakan di chat pribadi dengan bot
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Sertakan link undangan grup! Contoh: `.join https://chat.whatsapp.com/KodeUndanganAnda`');
    }

    // Ekstrak kode undangan dari link
    const match = text.match(/(?:https?:\/\/chat\.whatsapp\.com\/)?([0-9A-Za-z]{22})/);
    if (!match || !match[1]) {
      return m.reply('Link undangan tidak valid. Pastikan formatnya benar.');
    }
    const inviteCode = match[1];

      await m.reply('Mencoba bergabung ke grup...');
      const response = await criv.groupAcceptInvite(inviteCode);

      if (response) {
        const groupMetadata = await criv.groupMetadata(response.gid);
        await m.reply(`Berhasil bergabung ke grup: *${groupMetadata.subject}*!`);
      }
  }
};
