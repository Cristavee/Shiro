export default {
  command: ['decoin', 'recoin', 'kurangcoin'],
  tag: 'owner',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  async run(criv, { m, args, prefix, command, system }) {
    let user = m.quoted?.sender || m.mentionedJid?.[0] || args[0]
    let amount = parseInt(args[1])

    if (!user) return criv.reply(m, `> Tag atau reply pengguna.\nContoh: *${prefix + command} @user 100*`)
    if (isNaN(amount) || amount <= 0) return criv.reply(m, '> Masukkan jumlah coin yang valid')

    await system.subtractCoinIfEnough(user, amount)
    await system.saveDb()
    criv.reply(m, `> Berhasil mengurangi ${amount} coin dari ${user}`)
  }
}