export default {
  command: ['addcoin'],
  tag: 'owner',
  description: 'Menambahkan koin ke pengguna.',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 3000,

  async run(criv, {
    system,
    m,
    text,
    args,
    mentioned = [], 
    sender
  }) {
    const target = Array.isArray(mentioned) && mentioned.length > 0 ? mentioned[0] : args[0]
    const jumlah = parseInt(args[1])

    if (!target) return m.reply('Tag atau masukkan nomor target.\nContoh: .addcoin @user 100')
    if (isNaN(jumlah) || jumlah <= 0) return m.reply('Jumlah koin tidak valid.')

    const id = target.includes('@s.whatsapp.net') ? target : target.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

    const success = system.addCoin(id, jumlah)
    if (!success) return m.reply('Gagal menambahkan koin.')

    await system.saveDb()

    await m.reply(`> Berhasil menambahkan *${jumlah} coin* ke @${id.split('@')[0]}`, {
      mentions: [id]
    })

    await criv.sendMessage(id, {
      text: `> Kamu mendapatkan *${jumlah} coin*! 🎉`
    })
  }
}