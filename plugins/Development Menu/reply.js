export default {
  command: ['reply'],
  tag: 'dev',

  async run(criv, { m }) {
    if (!m.quoted) return m.reply(msg.reply)

    const type = Object.keys(m.quoted.message)[0]
    const content = m.quoted.message[type] || {}

    let info = `*Quoted Message*\n`
    info += `> Type: ${type}\n`
    info += `> From: ${m.quoted.sender}\n`
    info += `> Mimetype: ${m.quoted.mimetype || '-'}\n`
    info += `> Caption: ${content.caption || '-'}\n`
    info += `> File size: ${content.fileLength || 0} bytes`

    return m.reply(info)
  }
}