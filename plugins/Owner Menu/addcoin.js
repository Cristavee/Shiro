export default {
  command: ['addcoin'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 3000,

  async run(criv, { system, m, args, mentioned = [] }) {
    try {
      // Tentukan target
      const target = mentioned.length > 0 ? mentioned[0] : args[0];
      const jumlah = parseInt(args[1]);

      if (!target) {
        return m.reply('Tag atau masukkan nomor target.\nContoh: .addcoin @user 100');
      }

      if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('Jumlah koin tidak valid.');
      }

      // Pastikan format JID
      const id = target.includes('@s.whatsapp.net') ? target : target.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

      // Tambah koin
      const success = system.addCoin(id, jumlah);
      if (!success) return m.reply('Gagal menambahkan koin.');

      // Simpan database
      await system.saveDb();

      // Notifikasi ke pengirim
      await m.reply(`> Berhasil menambahkan *${jumlah} coin* ke @${id.split('@')[0]}`, {
        mentions: [id]
      });

      // Notifikasi ke penerima
      await criv.sendMessage(id, {
        text: `🎉 Kamu mendapatkan *${jumlah} coin*!`,
      });

    } catch (err) {
      console.error('Error addcoin:', err);
      await m.reply('❌ Terjadi kesalahan saat menambahkan koin.');
    }
  }
};