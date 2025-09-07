export default {
  command: ['acc', 'reject'], 
  tag: 'group', 
  description: 'Approve/Reject', 
  owner: false,
  admin: true, 
  botAdmin: true, 
  public: false, 
  group: true,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, from, command }) {
    try {
      const requests = await criv.groupRequestParticipantsList(from)
      if (!requests || requests.length === 0) {
        return m.reply('⚠️ Tidak ada request join yang pending.')
      }

      const users = requests.map(r => r.jid)

      const action = command === 'acc' ? 'approve' : 'reject'

      const response = await criv.groupRequestParticipantsUpdate(
        from,
        users,
        action
      )

      await m.reply(
        `✅ Berhasil ${action === 'approve' ? 'menerima' : 'menolak'} ${users.length} request join.`
      )
      console.log(response)

    } catch (e) {
      console.error(e)
      await m.reply('❌ Terjadi error saat memproses request.')
    }
  }
}