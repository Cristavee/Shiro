import fs from 'fs'
import path from 'path'

export default {
  command: ['listfile'],
  tag: 'dev',
  owner: true,

  async run(criv, { m }) {
    const baseDir = './plugins'
    const files = []

    function scan(dir) {
      const items = fs.readdirSync(dir)
      for (const item of items) {
        const fullPath = path.join(dir, item)
        if (fs.statSync(fullPath).isDirectory()) {
          scan(fullPath)
        } else if (fullPath.endsWith('.js')) {
          files.push(fullPath.replace(baseDir + '/', ''))
        }
      }
    }

    scan(baseDir)

    if (files.length === 0) {
      return m.reply('Tidak ada file plugin ditemukan.')
    }

    const list = files.map(f => `• ${f}`).join('\n')
    m.reply(`*Daftar Plugin (${files.length}):*\n\n${list}`)
  }
}