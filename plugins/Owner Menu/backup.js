import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

export default {
  command: ['backup', 'bak', 'bs'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m }) {
    try {
      await m.reply('📦 Sedang membuat backup script bot Anda. Mohon tunggu...');
      
      const timestamp = new Date().getTime();
      const outputFileName = `backup_${timestamp}.zip`;

      const __filename = fileURLToPath(import.meta.url);
      const pluginDirPath = path.dirname(__filename);
      const botRootPath = path.join(pluginDirPath, '..', '..');
      const outputPath = path.join(botRootPath, outputFileName);

      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Event saat selesai membuat zip
      output.on('close', async () => {
        console.log(`✅ Backup selesai: ${archive.pointer()} bytes`);
        try {
          const fileBuffer = fs.readFileSync(outputPath);
          await criv.sendFile(m.chat, fileBuffer, outputFileName, 'Backup.zip', m);

          fs.unlinkSync(outputPath);
          console.log(`🗑️ File backup ${outputFileName} berhasil dihapus dari server.`);
        } catch (sendError) {
          console.error('❌ Gagal mengirim atau menghapus file backup:', sendError);
          await m.reply(`❌ Gagal mengirim file backup: ${sendError.message}`);
        }
      });

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') console.warn('⚠️ Archiver Warning:', err);
        else throw err;
      });

      archive.on('error', (err) => {
        throw err;
      });

      archive.pipe(output);

      const filesAndFoldersToBackup = [
        'config.js',
        'handler.js',
        'index.js',
        'package.json',
        'LICENSE',
        'README.md',
        'plugins',
        'lib',
        'session',
      ];

      for (const item of filesAndFoldersToBackup) {
        const fullPath = path.join(botRootPath, item);
        const nameInZip = item;

        try {
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory()) archive.directory(fullPath, nameInZip);
          else if (stats.isFile()) archive.file(fullPath, { name: nameInZip });
        } catch (err) {
          console.warn(`⚠️ File atau folder tidak ditemukan: ${item}, backup akan dilanjutkan.`);
        }
      }

      archive.finalize();

    } catch (error) {
      console.error('❌ Error saat proses backup:', error);
      await m.reply(`❌ Terjadi kesalahan saat membuat backup: ${error.message}`);
    }
  }
};