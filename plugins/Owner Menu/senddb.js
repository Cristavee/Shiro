import fs from 'fs'
import path from 'path'

export default {
  command: ['senddb'],
  tag: 'owner',
  owner: true,
  public: false,
  coin: 0,
  cooldown: 10000,
  async run(criv, { m }) {
    const dbPath = path.resolve('./lib/database/data.json')

    try {
      const raw = fs.readFileSync(dbPath, 'utf-8')
      const parsed = JSON.parse(raw)
      const formatted = JSON.stringify(parsed, null, 2)
      const chunkSize = 4096

      if (formatted.length <= chunkSize) {
        await m.reply('> Isi Database:\n\n' + formatted)
      } else {
        await criv.sendFile(
          m.chat,
          Buffer.from(formatted),
          'database.json',
          '> Berikut isi database (file)',
          m
        )
      }
    } catch (err) {
      console.error('[SendDB Error]', err)
      await m.reply('> Gagal membaca isi database')
    }
  }
}