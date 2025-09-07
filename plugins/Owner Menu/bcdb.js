import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'

export default {
  command: ['backupdb', 'bcdb'],
  tag: 'owner',
  description: 'Backup database',
  owner: true,
  public: false,
  coin: 0,
  cooldown: 10000,

  async run(criv, { m }) {
    const sourcePath = path.resolve('./lib/database/data.json')
    const backupDir = path.resolve('./tmp')
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss')
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)

    try {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir)
      }

      fs.copyFileSync(sourcePath, backupFile)

      const filePath = `./tmp/backup-${timestamp}.json`;
    const fileBuffer = fs.readFileSync(filePath); 
    await criv.sendFile(m.chat, fileBuffer, 'data.json', 'data.json', m);
    } catch (err) {
        console.error(err)
    }
  }
}