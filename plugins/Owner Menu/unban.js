import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['unban'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 2000,
  async run(criv, { m, args, mentioned, system }) {
    let target = null
    if (mentioned > 0) {
      target = mentioned[0]
    } else if (args[0] && args[0].match(/\d+/)) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }

    if (!target) {
      return criv.sendMessage(
        m.chat,
        { text: `Penggunaan salah. Tag pengguna atau masukkan nomornya.\nContoh: *.unban @${m.sender.split('@')[0]}* atau *.unban 62812xxxxxx*` },
        { quoted: m }
      )
    }

    const id = decodeJid(target)
    system.addUser(id)

    if (!system.isUserBanned(id)) {
      return criv.sendMessage(
        m.chat,
        { text: `Pengguna ${id.split('@')[0]} tidak diblokir.` },
        { quoted: m }
      )
    }

    await system.unbanUser(id)

    return criv.sendMessage(
      m.chat,
      { text: `Berhasil membuka blokir ${id.split('@')[0]}.` },
      { quoted: m, mentions: [id] }
    )
  }
}