export default {
  command: ['creategroup', 'cgc', 'buatgc'], 
  tag: 'utility',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false,
  premium: false,
  coin: 10,
  cooldown: 5000,
  async run(criv, { m, text }) {
    try {
      if (!text) return m.reply('Kirim nama grup.\nContoh: .buatgc circle hitam')
      
      const gc = text.trim()
      if (!gc) return m.reply('Nama grup tidak boleh kosong.')

      const members = [
        criv.user.id.split(':')[0] + '@s.whatsapp.net',
        m.sender + '@s.whatsapp.net'
      ]

      const group = await criv.groupCreate(gc, members)
      m.reply(`Grup _${gc}_ berhasil dibuat.`)
    } catch (err) {
      console.error(err)
      m.reply('Gagal membuat grup.')
    }
  }
}