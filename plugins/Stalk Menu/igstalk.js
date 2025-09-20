import axios from 'axios'

export default {
  command: ['igstalk', 'instagramstalk'],
  tag: 'stalk',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,
  async run(criv, { m, text }) {
    if (!text) return m.reply('Masukkan username Instagram!\n\nContoh: .igstalk yahyaalmthr')

    try {
      const url = `https://api.vreden.my.id/api/v2/stalker/instagram?username=${encodeURIComponent(text)}`
      const res = await axios.get(url)
      const data = res.data

      if (!data.status || !data.result) {
        return m.reply('Gagal mendapatkan data, cek kembali username-nya!')
      }

      const result = data.result
      const caption = `
📷 *Instagram Stalk*

👤 Nama: ${result.users.full_name || '-'}
🔗 Username: @${result.users.username || text}
✅ Verified: ${result.users.is_verified ? 'Ya' : 'Tidak'}
📌 Kategori: ${result.users.category || '-'}
👥 Followers: ${result.users.follower_count || 0}
👥 Following: ${result.users.following_count || 0}
📂 Postingan: ${result.users.media_count || 0}
🌐 Website: ${result.users.external_url || '-'}
📝 Bio: ${result.users.biography || '-'}
      `.trim()

      await criv.sendImage(m.chat, result.image_account, caption, m)

    } catch (e) {
      console.error(e)
      m.reply('Terjadi error saat mengambil data.')
    }
  }
}