export default {
  command: ['checkuser'],
  tag: 'dev',
owner: true,
    async run(criv, { m, text, system }) {
    if (!text) return m.reply(msg.query)
    const user = system.getUser(text + '@s.whatsapp.net')
    await m.reply(`> DATA ${text}\n\n` + JSON.stringify(user, null, 2) + '\n')
  }
}