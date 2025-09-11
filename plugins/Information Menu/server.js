import os from 'os';
import { execSync } from 'child_process';

export default {
  command: ['server'],
  name: 'server',
  tag: 'information',
  public: true,

  async run(criv, { m }) {
    try {
      // Informasi OS
      const platform = os.platform();
      const type = os.type();
      const release = os.release();

      // Informasi CPU
      const cpus = os.cpus();
      const cpuModel = cpus[0].model;
      const cpuCores = cpus.length;

      // Informasi RAM
      const totalMem = os.totalmem() / 1024 / 1024 / 1024; // GB
      const freeMem = os.freemem() / 1024 / 1024 / 1024;    // GB
      const usedMem = totalMem - freeMem;

      // Informasi Storage
      let storageDetails = '';
      try {
        const stdout = execSync('df -h --output=source,size,used,avail,target -x tmpfs -x devtmpfs').toString();
        const lines = stdout.trim().split('\n').slice(1);

        storageDetails = '\n*Storage Disks:*\n';
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const [disk, size, used, avail, mount] = parts;
          storageDetails += `> Drive ${disk} (${mount}): Total ${size}, Terpakai ${used}, Bebas ${avail}\n`;
        });
      } catch (err) {
        storageDetails = '\nGagal mendapatkan info storage.';
      }

      // Format teks output
      const teks = `
*Server Information:*

  - _OS_
> OS Platform : ${platform}
> OS Type     : ${type}
> OS Release  : ${release}

  - _CPU_
> CPU Model   : ${cpuModel}
> CPU Cores   : ${cpuCores}

  - _RAM_
> RAM Total   : ${totalMem.toFixed(2)} GB
> RAM Terpakai: ${usedMem.toFixed(2)} GB
> RAM Bebas   : ${freeMem.toFixed(2)} GB
${storageDetails}
`.trim();

      await criv.sendMessage(m.chat, { text: teks }, { quoted: m });
    } catch (err) {
      console.error('Error ambil info server:', err);
      await m.reply('Maaf, gagal menampilkan informasi server.');
    }
  }
};