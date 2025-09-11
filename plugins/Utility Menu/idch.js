export default {
  command: ['ch', 'channel', 'idch'],
  tag: 'utility',
  public: true,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text }) {
    try {
      const input = text || m.quoted?.text
      if (!input) 
        return m.reply("Masukkan link channel!\nContoh: .ch https://whatsapp.com/channel/0029VaH8zLm2...")

      // Ambil key dari link channel
      const match = input.match(/whatsapp\.com\/channel\/([0-9A-Za-z]+)/)
      if (!match) return m.reply("Link channel tidak valid.")
      const key = match[1]

      // Ambil metadata channel
      const meta = await criv.newsletterMetadata("invite", key, "GUEST").catch(() => null)
      if (!meta) return m.reply("Tidak bisa mengambil info channel.")

      // Siapkan caption info channel
      const caption = `📢 *Informasi Channel*\n\n` +
        `> Nama: ${meta.name || "Tidak ada"}\n` +
        `> ID: ${meta.id?.jid || key + "@newsletter"}\n` +
        `> Jumlah Follower: ${meta.subscribers || "0"}\n` +
        `> Deskripsi: ${meta.description || "Tidak ada"}`

      // Kirim pesan dengan tombol interaktif untuk copy ID
      await criv.sendMessage(m.chat, {
        text: caption,
        footer: "Channel Info",
        interactiveButtons: [
          {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "Copy ID Channel",
              id: meta.id?.jid,
              copy_code: meta.id?.jid
            })
          }
        ]
      })

    } catch (e) {
      console.error('Channel info error:', e)
      m.reply("❌ Terjadi error saat mengambil info channel.")
    }
  }
}