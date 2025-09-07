export default {
  command: ['detailmenu', 'menus'],
  tag: '',
  description: 'Menampilkan deskripsi',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  coin: 5,
  premium: false,

  async run(criv, { m, args, pushName }) {
    const plugins = criv.plugins || {}
    const categorized = {}

    for (const plug of Object.values(plugins)) {
      if (!plug.tag) continue

      const tag = plug.tag.toUpperCase()
      if (!categorized[tag]) categorized[tag] = []

      const commands = Array.isArray(plug.command) ? plug.command : [plug.command]
      for (const cmd of commands) {
        if (!cmd) continue

        const exists = categorized[tag].some(item => item.command === cmd)
        if (!exists) {
          categorized[tag].push({
            command: cmd,
            description: plug.description || 'Tanpa Deskripsi'
          })
        }
      }
    }

    const filterTag = args[0] ? args[0].toUpperCase() : null
    const tagsToShow = filterTag && categorized[filterTag]
      ? { [filterTag]: categorized[filterTag] }
      : categorized

    if (filterTag && !categorized[filterTag]) {
      const available = Object.keys(categorized).map(t => `- ${t}`).join('\n')
      return m.reply(`[ ! ] Kategori *${filterTag}* tidak ditemukan.\n\nKategori yang tersedia:\n${available}`)
    }

    let menu = `${global.getGreet(pushName || m.pushName)}\n\n`

    for (const [tag, cmdsArr] of Object.entries(tagsToShow)) {
      if (!cmdsArr.length) continue
      menu += `> *${tag} MENU:*\n`
      for (const item of cmdsArr) {
        menu += `> › *${global.prefix[0]}${item.command}*\n> ${item.description}\n`
      }
      menu += '\n'
    }

    try {
      await criv.sendMessage(m.chat, {
  text: menu,
  contextInfo: {
    externalAdReply: {
      showAdAttribution: false,
      title: "Main menu",
      body: "© Cristave 2025",
      thumbnailUrl: global.thumb,
      sourceUrl: "https://github.com/Cristavee",
      mediaType: 1,
      renderLargerThumbnail: true
    },
    isForwarded: true
  },
  ephemeralExpiration: 86400,
  footer: global.footer
}, {
  quoted: {
    key: {
      remoteJid: '0@s.whatsapp.net',
      fromMe: false,
      id: 'BAE5F1E87A7CABA5F74A3213DE6B1C9B'
    },
    message: {
      conversation: global.bot.ownerName
    }
  }
})
    } catch (error) {
      console.error('Error sending detail menu:', error)
      await m.reply(menu.trim())
    }
  }
}