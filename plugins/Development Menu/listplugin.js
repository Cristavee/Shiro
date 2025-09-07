import fs from 'fs'
import path from 'path'

export default {
  command: ['listfile'],
  tag: 'dev',
  description: 'Daftar semua file plugin yang terbaca',
  owner: true,

  async run(criv, { m }) {
    const dir = './plugins'
    const files = []

    function scan(dirPath) {
      const items = fs.readdirSync(dirPath)
      for (const item of items) {
        const fullPath = path.join(dirPath, item)
        if (fs.statSync(fullPath).isDirectory()) scan(fullPath)
        else if (fullPath.endsWith('.js')) files.push(fullPath)
      }
    }

    scan(dir)

    m.reply('Plugin Files:\n\n' + files.map(f => '- ' + f.replace('./plugins/', '')).join('\n'))
  }
}