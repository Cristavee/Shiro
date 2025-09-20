export default {
  command: ['group', 'gc', 'gcinfo'],
  tag: 'group',
  public: true,
  group: true,

  async run(criv, { m, sender }) {
    try {
      const metadata = await criv.groupMetadata(m.chat)
      const { id, subject, owner, participants, creation, desc } = metadata

      const admins = participants.filter(p => p.admin).map(p => p.id)
      const isAdmin = admins.includes(sender)
      const isOwner = owner === sender

      const groupCreation = creation
        ? new Date(creation * 1000).toLocaleString('id-ID')
        : '-'

      let teks = `👥 *Informasi Grup*\n`
      teks += `────────────────────\n`
      teks += `> Nama      : ${subject}\n`
      teks += `> Owner     : @${owner?.split('@')[0] || '-'}\n`
      teks += `> Dibuat    : ${groupCreation}\n`
      teks += `> Anggota   : ${participants.length} anggota\n`
      teks += `> Kamu      : ${isOwner ? 'Owner' : isAdmin ? 'Admin' : 'Member'}\n`
      teks += `> Deskripsi :\n${desc?.split('\n')[0] || 'Tidak ada'}\n`

      await criv.sendMessage(
        m.chat,
        {
          text: teks.trim(),
          mentions: [owner]
        },
        { quoted: m }
      )
    } catch (err) {
      console.error('Error mengambil info grup:', err)
      await m.reply('Gagal mengambil informasi grup.')
    }
  }
}