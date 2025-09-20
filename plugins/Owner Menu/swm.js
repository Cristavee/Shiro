import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default {
  command: ['setwame'],
  tag: 'utility',
  owner: true,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 0,
  cooldown: 3000,
  async run(criv, { m, text }) {
    let pack = global.pack
    let author = global.author

    if (!text) {
      return m.reply(
        `Watermark stiker saat ini:\n` +
        `> Pack: *${pack || 'Tidak diset'}*\n` +
        `> Author: *${author || 'Tidak diset'}*\n\n` +
        `Gunakan format: *.setwm <nama_pack> | <nama_author>*`
      )
    }

    const parts = text.split('|').map(s => s.trim())
    pack = parts[0] || pack
    author = parts[1] || author

    global.pack = pack
    global.author = author

    return m.reply(
      `Watermark stiker berhasil diatur:\n` +
      `> Pack: *${global.pack}*\n` +
      `> Author: *${global.author}*\n\n` +
      `Stiker selanjutnya akan menggunakan watermark ini.`
    )
  }
}