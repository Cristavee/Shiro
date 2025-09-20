import db from '../../lib/db.js';
import moment from 'moment-timezone';
import os from 'os';

export default {
  command: ['stats', 'statistik', 'stat'],
  tag: 'information',
  public: true,

  async run(criv, { m, system }) {
    try {
      // User stats
      const users = Object.keys(db.data.users || {}).length;
      const premiumUsers = Object.values(db.data.users || {}).filter(u => u?.premium).length;
      const bannedUsers = Object.values(db.data.users || {}).filter(u => u?.isBanned).length;
      const blacklist = system.listBl().length;
      const ownerCount = system.getOwnerList().length;
      const totalFeatures = global.totalFeature || Object.keys(criv.plugins || {}).length;

      // Bot uptime & current time
      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss, DD MMMM YYYY');

      // System info
      const memUsed = (os.totalmem() - os.freemem()) / 1024 / 1024; // MB
      const memTotal = os.totalmem() / 1024 / 1024;                  // MB
      const cpuModel = os.cpus()[0].model;
      const platform = os.platform();

      // Format teks
      const teks = `
╭───〔 *📊 Statistik Bot* 〕
│ 🕒 Waktu         : ${currentTime}
│ ⏳ Uptime        : ${uptime}
│
│ 👤 Total User    : ${users}
│ ⭐ Premium       : ${premiumUsers}
│ 🚫 Banned       : ${bannedUsers}
│ 📋 Blacklist    : ${blacklist}
│ 👑 Owner Aktif  : ${ownerCount}
│ ⚙️ Total Fitur  : ${totalFeatures}
│
│ 💻 OS           : ${platform}
│ 🖥️ CPU          : ${cpuModel}
│ 📈 RAM          : ${memUsed.toFixed(2)} / ${memTotal.toFixed(2)} MB
│ ♥️ Like         : ${system.getLike()}
╰───────────────`.trim();

      await m.reply(teks);
    } catch (e) {
      console.error('Error stats:', e);
      await m.reply('❌ Gagal mengambil statistik.');
    }
  }
};