export default {
  command: ['send'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 0,
  cooldown: 3000,
  async run(criv, { system, m, getName, args, sender, pushName }) {
    const nomor = (args[0] || '').replace(/\D/g, '')
    if (!nomor) {
      return m.reply(
        '> Contoh:\n' +
        '> .send 6281234567890\n' +
        '> atau\n' +
        '> .send 6281234567890 Hai <tag>, saya <namabot>, <owner>, <pengirim>'
      )
    }

    const jid = nomor + '@s.whatsapp.net'
    const customText = args.slice(1).join(' ')
    const botName = global.bot?.name || 'Bot'
    const ownerID = global.bot?.owner || '628xxxxxx'
    const ownerName = global.bot?.ownerName || 'Owner Bot'
    const pengirimName = await getName(sender).catch(() => pushName || sender.split('@')[0])

    const isiPesan = customText || `> Hai <tag>, saya *${botName}*, saya diutus oleh *${ownerName}* untuk menyapa Anda. Ada yang bisa saya bantu? atau ketik .menu`
    const message = isiPesan
      .replace(/<tag>/gi, `@${nomor}`)
      .replace(/<namabot>/gi, botName)
      .replace(/<owner>/gi, ownerName)
      .replace(/<pengirim>/gi, pengirimName)

    try {
      await criv.sendMessage(jid, {
        text: message,
        ai: true,
        mentions: [jid]
      })
      m.reply(`> Pesan berhasil dikirim ke wa.me/${nomor}`)
    } catch (err) {
      m.reply(`> Gagal mengirim pesan: ${err.message}`)
    }
  }
}