import axios from 'axios'

export default {
  command: ['igstalk', 'instagramstalk'],
  tag: 'search',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m, text }) {
    if (!text) return m.reply(msg.query)

    try {
      const url = `https://api.vreden.my.id/api/igstalk?query=${encodeURIComponent(text)}`
      const res = await axios.get(url)
      const data = res.data

      if (data.status !== 200 || !data.result?.user) {
        return m.reply(`Akun Instagram "${text}" tidak ditemukan atau terjadi kesalahan`)
      }

      const user = data.result.user
      let msgText = `Info Akun Instagram untuk *@${user.username}*:\n\n`
      msgText += `Nama Lengkap: ${user.full_name || '-'}\n`
      msgText += `Bio: ${user.biography || '-'}\n`
      msgText += `Kategori: ${user.category || '-'}\n`
      msgText += `Akun Bisnis: ${user.is_business ? 'Ya' : 'Tidak'}\n`
      msgText += `Akun Private: ${user.is_private ? 'Ya' : 'Tidak'}\n`
      msgText += `Terverifikasi: ${user.is_verified ? 'Ya' : 'Tidak'}\n`
      msgText += `Pengikut: ${user.follower_count?.toLocaleString() || '0'}\n`
      msgText += `Mengikuti: ${user.following_count?.toLocaleString() || '0'}\n`
      msgText += `Jumlah Postingan: ${user.media_count?.toLocaleString() || '0'}\n`
      if (user.external_url) msgText += `Link Bio: ${user.external_url}\n`

      const profilePic = data.result.image || user.hd_profile_pic_url_info?.url || user.profile_pic_url_hd
      if (profilePic) {
        await criv.sendMessage(
          m.chat,
          { image: { url: profilePic }, caption: msgText },
          { quoted: m }
        )
      } else {
        await criv.sendMessage(m.chat, { text: msgText }, { quoted: m })
      }

    } catch (err) {
      console.error('IGStalk error:', err)
      m.reply('Terjadi kesalahan saat mengambil data akun Instagram')
    }
  }
}