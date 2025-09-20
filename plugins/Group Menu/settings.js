export default {
  command: ['groupset', 'gsetting', 'set'],
  tag: 'group',
  owner: false,
  admin: true, // hanya admin bisa pakai
  botAdmin: true, // bot harus admin untuk update
  public: true,
  group: true, // hanya grup
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, from, args }) {
    try {
      if (!args[0]) {
        return criv.sendMessage(from, {
          text: 
            '📌 Gunakan perintah:\n' +
            '1. close - hanya admin yang bisa kirim pesan\n' +
            '2. open - semua anggota bisa kirim pesan\n' +
            '3. adminset - hanya admin yang bisa ubah pengaturan grup\n' +
            '4. allset - semua anggota bisa ubah pengaturan grup'
        }, { quoted: m });
      }

      const setting = args[0].toLowerCase();

      switch (setting) {
        case 'close':
          await criv.groupSettingUpdate(from, 'announcement');
          await criv.sendMessage(from, { text: '✅ Grup sekarang hanya admin yang bisa mengirim pesan.' }, { quoted: m });
          break;
        case 'open':
          await criv.groupSettingUpdate(from, 'not_announcement');
          await criv.sendMessage(from, { text: '✅ Grup sekarang semua anggota bisa mengirim pesan.' }, { quoted: m });
          break;
        case 'adminset':
          await criv.groupSettingUpdate(from, 'locked');
          await criv.sendMessage(from, { text: '✅ Hanya admin yang bisa mengubah pengaturan grup.' }, { quoted: m });
          break;
        case 'allset':
          await criv.groupSettingUpdate(from, 'unlocked');
          await criv.sendMessage(from, { text: '✅ Semua anggota bisa mengubah pengaturan grup.' }, { quoted: m });
          break;
        default:
          await criv.sendMessage(from, { text: '⚠️ Pengaturan tidak dikenali.' }, { quoted: m });
      }
    } catch (error) {
      console.error('[ERROR] Gagal mengubah pengaturan grup:', error);
      await criv.sendMessage(from, { text: '❌ Terjadi kesalahan saat mengubah pengaturan grup.' }, { quoted: m });
    }
  }
};