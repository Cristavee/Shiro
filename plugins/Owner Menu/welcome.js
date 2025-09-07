export default {
  command: ['welcome'],
  tag: 'owner',
  description: 'Aktifkan atau nonaktifkan fitur welcome (on/off)',
  owner: true,
  public: true,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(`Gunakan:
.welcome on → aktifkan fitur welcome
.welcome off → nonaktifkan fitur welcome`)
    }

    const mode = text.toLowerCase().trim()

    if (mode === 'on') {
      criv.welcome = true
      return m.reply('Fitur welcome sekarang *AKTIF*.')
    }

    if (mode === 'off') {
      criv.welcome = false
      return m.reply('Fitur welcome sekarang *NONAKTIF*.')
    }

    return m.reply('Input tidak dikenali. Gunakan: .welcome on atau .welcome off')
  }
}