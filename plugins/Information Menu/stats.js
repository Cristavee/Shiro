import db from '../../lib/db.js'
import moment from 'moment-timezone'
import os from 'os'
  export default {
  command: ['stats', 'statistik', 'stat'],
  tag: 'information',
public: true,
    async run(criv, { m, system }) {
    try {
      const users = Object.keys(db.data.users || {}).length
      const premiumUsers = Object.values(db.data.users || {}).filter(u => u?.premium).length
      const bannedUsers = Object.values(db.data.users || {}).filter(u => u?.isBanned).length
      const blacklist = system.listBl().length
      const owner = system.getOwnerList().length
      const fitur = global.totalFeature || Object.keys(criv.plugins || {}).length
        const uptime = moment.duration(process.uptime() * 1000).humanize()
      const waktu = moment().tz('Asia/Jakarta').format('HH:mm:ss, DD MMMM YYYY')
        // Info OS
      const memUsed = (os.totalmem() - os.freemem()) / 1024 / 1024
      const memTotal = os.totalmem() / 1024 / 1024
      const cpuModel = os.cpus()[0].model
      const platform = os.platform()
        const teks = `╭───〔 *📊 Statistik Bot* 〕
│ 🕒 Waktu: ${waktu}
│ ⏳ Uptime: ${uptime}
│ 
│ 👤 Total User: ${users}
│ ⭐ Premium: ${premiumUsers}
│ 🚫 Banned: ${bannedUsers}
│ 📋 Blacklist: ${blacklist}
│ 👑 Owner Aktif: ${owner}
│ ⚙️ Total Fitur: ${fitur}
│ 
│ 💻 OS: ${platform}
│ 🖥️ CPU: ${cpuModel}
│ 📈 RAM: ${memUsed.toFixed(2)} / ${memTotal.toFixed(2)} MB
│ ♥️ Like: ${system.getLike()}
╰───────────────`
        await m.reply(teks.trim())
    } catch (e) {
      console.error('Error stats:', e)
      await m.reply('Gagal mengambil statistik.')
    }
  }
}