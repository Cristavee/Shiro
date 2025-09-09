export default {
  command: ['searchplugin', 'findplugin', 'plugin'],
  tag: 'dev',
owner: true,
    async run(criv, { m, text }) {
    if (!text) return m.reply(msg.query)
      const result = Object.entries(criv.plugins)
      .map(([cmd, plugin]) => {
        const desc = plugin.description || ''
        return `> ${cmd} - ${desc}`
      })
      .filter(line => line.toLowerCase().includes(text.toLowerCase()))
      if (result.length === 0) return m.reply('Tidak ada plugin ditemukan.')
    m.reply('Plugin ditemukan:\n\n' + result.join('\n'))
  }
}