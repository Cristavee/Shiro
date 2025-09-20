export default {
  command: ['cekidch', 'ch', 'checkidch'],
  tag: 'utility',
  public: true,
  cooldown: 5000,
  coin: 0,

  async run(criv, { m, text }) {
    if (!text) return criv.reply(m, '❗ Give the channel URL or invite key.')
    const input = text.trim()
    const re = /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([0-9A-Za-z-_]+)/i
    const match = input.match(re)
    const key = match ? match[1] : input.split(/\s+/)[0]
    if (!key || !/^[0-9A-Za-z-_]{8,}$/.test(key)) return criv.reply(m, '❗ Invalid channel key/URL.')

    let meta
    try {
      meta = await criv.newsletterMetadata('invite', key, 'GUEST')
    } catch (e) {
      return criv.reply(m, '❌ Failed to fetch channel metadata.')
    }
    if (!meta || !meta.id) return criv.reply(m, '⚠️ Channel not found.')

    const created = meta.creation_time ? new Date(meta.creation_time * 1000).toLocaleString() : '-'
    const desc = meta.description ? String(meta.description).trim() : '-'
    const subs = typeof meta.subscribers === 'number' ? meta.subscribers : (meta.subscribers || '-')
    const caption =
`📢 *Channel Info*
> *Name*   : ${meta.name || '-'}
> *ID*     : ${meta.id || key}
> *Invite* : ${key}
> *Created*: ${created}
> *Subs*   : ${subs}
> *Verified*: ${meta.verification || '-'}

📜 *Description:*
${desc}`

    const url = `https://whatsapp.com/channel/${key}`
    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy ID",
          id: meta.id,
          copy_code: meta.id
        })
      },
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy Name",
          id: meta.name || '-',
          copy_code: meta.name || '-'
        })
      },
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy URL",
          id: url,
          copy_code: url
        })
      }
    ]

    let pic = meta.picture || meta.preview || null
    if (pic && !pic.startsWith('http')) pic = null
    if (pic) {
      await criv.sendMessage(m.chat, { image: { url: pic }, caption, interactiveButtons: buttons }, { quoted: m })
    } else {
      await criv.sendMessage(m.chat, { text: caption, interactiveButtons: buttons }, { quoted: m })
    }
  }
}