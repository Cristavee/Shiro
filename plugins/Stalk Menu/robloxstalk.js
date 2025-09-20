import axios from 'axios'

export default {
  command: ['roblox', 'rbstalk'],
  tag: 'stalk',
  public: true,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, args }) {
    const username = args[0]
    if (!username) return criv.reply(m, '❌ Masukkan username Roblox.\nContoh: .roblox just_qristian')

    try {
      const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/roblox?user=${encodeURIComponent(username)}`)
      if (!data.status || !data.data) throw new Error('Data tidak ditemukan.')

      const user = data.data.basic
      const presence = data.data.presence?.userPresences?.[0]
      const social = data.data.social
      const avatar = data.data.avatar.headshot?.data?.[0]

      let teks = `*Profile Roblox*\n`
      teks += `> Username: *${user.name}*\n`
      teks += `> Display: ${user.displayName}\n`
      teks += `> Deskripsi: ${user.description || '-'}\n`
      teks += `> Dibuat: ${new Date(user.created).toLocaleDateString('id-ID')}\n`
      teks += `> Status Banned: ${user.isBanned ? 'Ya ⚠️' : 'Tidak ✅'}\n`
      teks += `> Lokasi Terakhir: ${presence?.lastLocation || '-'}\n\n`

      teks += `*👥 Sosial*\n`
      teks += `> Teman: ${social.friends?.count || 0}\n`
      teks += `> Followers: ${social.followers?.count || 0}\n`
      teks += `> Following: ${social.following?.count || 0}\n`

      await criv.sendImage(m.chat, avatar?.imageUrl || '', teks, m)
    } catch (err) {
      console.error('Roblox Stalker Error:', err)
      criv.reply(m, '❌ Gagal mengambil data. Username mungkin salah atau server error.')
    }
  }
}
