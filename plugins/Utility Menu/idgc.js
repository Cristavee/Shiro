export default {
  command: ['cekidgc', 'gc', 'checkidgc'],
  tag: 'utility',
  public: true,
  cooldown: 5000,
  coin: 0,

  async run(criv, { m }) {
    if (!m.isGroup) return criv.reply(m, '❗ Command ini hanya bisa di dalam grup.')

    let meta
    try {
      meta = await criv.groupMetadata(m.chat)
    } catch (e) {
      return criv.reply(m, '❌ Gagal mengambil metadata grup.')
    }
    if (!meta || !meta.id) return criv.reply(m, '⚠️ Grup tidak ditemukan.')

    const created = meta.creation ? new Date(meta.creation * 1000).toLocaleString() : '-'
    const desc = meta.desc ? String(meta.desc).trim() : '-'
    const owner = meta.owner || '-'
    const subs = meta.size || (meta.participants ? meta.participants.length : '-')

    const admins = meta.participants
      .filter(p => p.admin)
      .map(p => `• ${p.jid.replace(/@s.whatsapp.net$/, '')} (${p.admin})`)
      .join('\n') || '-'

    const caption =
`👥 *Group Info*
> *Name*    : ${meta.subject || '-'}
> *ID*      : ${meta.id}
> *Owner*   : ${owner}
> *Created* : ${created}
> *Members* : ${subs}

🛡️ *Admins:*
${admins}

📜 *Description:*
${desc}`

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
          id: meta.subject || '-',
          copy_code: meta.subject || '-'
        })
      },
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy Owner",
          id: owner,
          copy_code: owner
        })
      }
    ]

    await criv.sendMessage(m.chat, { text: caption, interactiveButtons: buttons }, { quoted: m })
  }
}