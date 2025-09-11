import axios from 'axios'

export default {
  command: ['roblox', 'rbstalk'],
  tag: 'search',
  public: true,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, args }) {
    const username = args[0]
    if (!username) return criv.reply(m, msg.query)

    try {
      const { data } = await axios.get(`https://zenz.biz.id/stalker/roblox?username=${encodeURIComponent(username)}`)
      if (!data.status || !data.success) throw new Error('Data tidak ditemukan.')

      const user = data.data.account
      const presence = data.data.presence
      const stats = data.data.stats
      const badges = data.data.badges.slice(0, 3)
      const friends = data.data.friendList.slice(0, 3)

      let teks = `*Profile Roblox*\n`
      teks += `> Username: *${user.username}*\n`
      teks += `> Display: ${user.displayName}\n`
      teks += `> Deskripsi: ${user.description || '-'}\n`
      teks += `> Dibuat: ${new Date(user.created).toLocaleDateString('id-ID')}\n`
      teks += `> Status: ${presence.isOnline ? 'Online 🟢' : 'Offline 🔴'}\n`
      teks += `> Game terakhir: ${presence.recentGame || '-'}\n`
      teks += `> Teman: ${stats.friendCount}\n`
      teks += `> Followers: ${stats.followers}\n`
      teks += `> Following: ${stats.following}\n\n`

      teks += `*🏅 3 Badge Teratas:*\n`
      if (!badges.length) teks += `• Tidak ada badge.\n`
      else badges.forEach(badge => {
        teks += `> ${badge.name} – ${badge.description || 'Tanpa deskripsi'}\n`
      })

      teks += `\n*👥 3 Teman Teratas:*\n`
      if (!friends.length) teks += `> Tidak ada teman.\n`
      else friends.forEach(friend => {
        teks += `> ${friend.displayName} (@${friend.name})\n`
      })

      await criv.sendImage(m.chat, user.profilePicture, teks, m)
    } catch (err) {
      console.error('Roblox Stalker Error:', err)
      criv.reply(m, '❌ Gagal mengambil data. Username mungkin salah atau server error.')
    }
  }
}