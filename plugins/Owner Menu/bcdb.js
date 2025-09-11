import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

export default {
  command: ['backupdb', 'bcdb'],
  tag: 'owner',
  owner: true,
  public: false,
  coin: 0,
  cooldown: 10000,

  async run(criv, { m }) {
    try {
      const sourcePath = path.resolve('./lib/database/data.json');
      const backupDir = path.resolve('./tmp');

      // Buat folder backup jika belum ada
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Nama file backup dengan timestamp
      const timestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD_HH-mm-ss');
      const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

      // Salin file database
      fs.copyFileSync(sourcePath, backupFile);

      // Baca buffer untuk dikirim
      const fileBuffer = fs.readFileSync(backupFile);

      await criv.sendFile(
        m.chat,
        fileBuffer,
        `backup-${timestamp}.json`,
        'Berikut file backup database bot Anda.',
        m
      );

      console.log(`Backup database berhasil: ${backupFile}`);
    } catch (err) {
      console.error('Gagal membuat backup database:', err);
      await criv.sendMessage(m.chat, { text: `❌ Gagal membuat backup database: ${err.message}` }, { quoted: m });
    }
  }
};