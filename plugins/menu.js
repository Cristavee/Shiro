import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export default {
  command: ['menu'],
  tag: 'main',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  coin: 3,
  premium: false,
  
  async run(criv, { m, args, pushName, readMore }) {
    const plugins = criv.plugins || {}
    const cat = {}

    for (const plug of Object.values(plugins)) {
      if (!plug.tag) continue

      const tag = plug.tag.toUpperCase()
      if (!cat[tag]) cat[tag] = []

      let cmds = Array.isArray(plug.command) ? plug.command[0] : plug.command
      if (!cmds) continue

      if (plug.owner) cmds += ' ⓞ'
      else if (plug.premium) cmds += ' ℗'
      else if (plug.coin) cmds += ' ©'
      else cmds += ' ⓕ'

      if (!cat[tag].includes()) {
        cat[tag].push(cmds)
      }
    }

    // Filter berdasarkan tag jika ada
    const filterTag = args[0]?.toUpperCase()
    const tgs = filterTag && cat[filterTag] 
      ? { [filterTag]: cat[filterTag] } 
      : cat

    if (filterTag && !cat[filterTag]) {
      const available = Object.keys(cat).map(t => `- ${t}`).join('\n')
      return m.reply(`[ ! ] Kategori *${filterTag}* tidak ditemukan.\n\nKategori yang tersedia:\n${available}`)
    }

    // Membuat teks menu
    let menu = ` ${global.getGreet(pushName)}\n${readMore}`
    for (const [tag, cmds] of Object.entries(tgs)) {
      menu += `\n*⌘ ${tag} MENU:*\n`
      for (const cmd of cmds) {
        menu += ` ﹄ ${global.prefix[0]}${cmd}\n`
      }
    }

    try {
      await criv.sendMessage(
        m.chat,
        {
          text: menu,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: global.wm,
              thumbnailUrl: global.thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            },
            isForwarded: true
          },
          ephemeralExpiration: 32000,
          footer: global.footer
        },
        {
          quoted: {
            key: {
              remoteJid: '0@s.whatsapp.net',
              fromMe: false,
              id: 'BAE5F1E87A7CABA5F74A3213DE6B1C9B'
            },
            message: { conversation: 'Hai ' + m.pushName }
          }
        }
      )
    } catch (error) {
      console.error('❌ Error mengirim menu:', error)
      m.reply('Terjadi kesalahan saat mengirim menu.')
    }
  }
}
