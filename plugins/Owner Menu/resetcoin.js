export default {
  command: ['decoin', 'recoin', 'kurangcoin'],
  tag: 'owner',
  description: 'Kurangi coin pengguna, termasuk owner.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,

  async run(criv, { m, args, prefix, command }) {
    const target = m.quoted?.sender || m.mentionedJid?.[0] || args[0]
    const jumlah = parseInt(args[1])

    if (!target) return criv.reply(m, `> Tag atau reply pengguna.\nContoh: *${prefix + command} @user 100*`)
    if (isNaN(jumlah) || jumlah <= 0) return criv.reply(m, '> Masukkan jumlah coin yang valid.')
    await system.subtractCoinIfEnough(target, jumlah)
    await system.saveDb()
    criv.reply(m, `> Berhasil mengurangi ${jumlah} coin dari ${target}.`)
  }
}