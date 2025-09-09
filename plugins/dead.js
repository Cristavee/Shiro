import fs from 'fs'
import path from 'path'
export default {
  command: ['deldesc'],
  tag: 'dev',
  owner: true,async run(criv, { m }) {
    try {
      const pluginsDir = './plugins' // root folder plugin kamu
      let deleted = 0
      function removeDescription(dir) {
        const files = fs.readdirSync(dir)
        for (const file of files) {
          const filePath = path.join(dir, file)
          const stat = fs.statSync(filePath)
          if (stat.isDirectory()) {
            // masuk ke folder kategori (rekursif)
            removeDescription(filePath)
          } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf-8')
            // hapus baris ""
            let newContent = content.replace(
  /(\s*description:\s*['"`][^'"`]*['"`],?\s*\n?)/g,
  '\n'
).replace(/\n{2,}/g, '\n'+'  '); 
            if (newContent !== content) {
              fs.writeFileSync(filePath, newContent, 'utf-8')
              deleted++
            }
          }
        }
      }
      removeDescription(pluginsDir)
      await m.reply(`✅ Success!\nRemoved description from *${deleted}* plugins.`)
    } catch (err) {
      console.error(err)
      await m.reply('❌ Error while deleting descriptions.')
    }
  }
}