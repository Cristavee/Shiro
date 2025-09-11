export default {
  command: ['requestjoin', 'request'],
  tag: 'group',
  owner: false,
  admin: false,
  botAdmin: true,
  public: true,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, from }) {
    try {
      const response = await criv.groupRequestParticipantsList(from)

      if (!response || response.length === 0) {
        return criv.sendMessage(from, { text: 'Tidak ada request join saat ini.' }, { quoted: m })
      }

      let listText = '*Daftar Request Join Grup:*\n\n'
      response.forEach((r, i) => {
        listText += `> ${i + 1}. ${r.id}\n`
      })

      await criv.sendMessage(from, { text: listText }, { quoted: m })
    } catch (error) {
      console.error('[ERROR] Gagal mengambil request join:', error)
      await criv.sendMessage(from, { text: 'Terjadi kesalahan saat mengambil daftar request join.' }, { quoted: m })
    }
  }
}