import axios from 'axios'
import mime from 'mime-types'

export default {
  command: ['get'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m, text }) {
    if (!text) return m.reply('> Masukkan URL yang ingin diambil')
    const valid = /^(http|https):\/\/[^ "]+$/.test(text)
    if (!valid) return m.reply('> URL harus diawali http:// atau https://')

    try {
      const r = await axios.get(text, { responseType: 'arraybuffer' })
      const ct = r.headers['content-type'] || ''
      const buf = Buffer.from(r.data)

      if (ct.includes('text') || ct.includes('json') || ct.includes('xml')) {
        let c = buf.toString('utf-8')
        if (ct.includes('json')) {
          try { c = JSON.stringify(JSON.parse(c), null, 2) } catch {}
        }
        if (c.length > 4000) c = c.slice(0, 4000) + '\n\n> ...(dipotong)'
        return m.reply(`GET dari ${text}:\n\n${c}`)
      }

      const ext = mime.extension(ct) || 'bin'
      const fn = `get-result.${ext}`
      await criv.sendFile(m.chat, buf, fn, null, m)
    } catch (e) {
      console.error(e)
      m.reply('> Gagal mengambil isi URL. Coba lagi nanti')
    }
  }
}