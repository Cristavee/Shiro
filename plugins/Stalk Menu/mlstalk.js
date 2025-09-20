import axios from 'axios'

export default {
  command: ['mlstalk', 'mlprofile'],
  tag: 'stalk',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply(msg.query)

    const parts = text.split(/[()\s]+/)
    let id = parts[0]
    let zone = parts[1]

    if (!id || !zone) {
      return m.reply('Contoh: .mlstalk 12345678 (1234)')
    }

    zone = zone.replace(/\D/g, '')
    if (isNaN(id) || isNaN(zone)) {
      return m.reply('ID dan Zone ID harus berupa angka\nContoh: .mlstalk 12345678 (1234)')
    }

    try {
      const apiUrl = `https://api.vreden.my.id/api/mlstalk?id=${encodeURIComponent(id)}&zoneid=${encodeURIComponent(zone)}`
      const { data } = await axios.get(apiUrl)

      if (data.status !== 200 || !data.result?.data?.userNameGame) {
        return m.reply(`Data pemain MLBB untuk ID ${id} dan Zone ID ${zone} tidak ditemukan`)
      }

      const user = data.result.data
      const msgText = `Informasi Akun Mobile Legends

ID Game  : ${id}
Zone ID  : ${zone}
Username : ${user.userNameGame}`

      await criv.sendMessage(m.chat, { text: msgText }, { quoted: m })
    } catch (err) {
      console.error(err)
      m.reply(msg.error)
    }
  }
}