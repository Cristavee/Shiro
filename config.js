import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'

// ─── Bot Settings ─────────────────────────────────
global.usePairingCode = true
global.cuspair = 'AAAAAAAA' // MUST BE 8 DIGITS
global.bot = {
  name: '',
  owner: '',
  ownerName: '',
  full: ''
}
global.thumb = 'https://pomf2.lain.la/f/10xr5ka8.png'
global.wm = `© ${global.bot.ownerName} 2025`

// ─── Sticker ──────────────────────────────────────
global.pack = 'Shiro Sticker'
global.author = 'WhatsApp Bot'

// ─── Owner List ───────────────────────────────────
global.owner = [`${global.bot.owner}@s.whatsapp.net`]

// ─── Command Prefix ───────────────────────────────
global.prefix = ['.', '!', '/', ',']

// ─── Social Media ─────────────────────────────────
global.ig = ''
global.wa = ''
global.git = ''
global.yt = ''
global.fb = ''

// ─── Default Bot Responses ────────────────────────
global.msg = {
  owner: "This command can only be used by the Owner.",
  admin: "This command can only be used by Group Admins.",
  botAdmin: "The bot needs to be an Admin to run this command.",
  group: "This command can only be used in this group.",
  private: "This command can only be used in a private chat.",
  error: "An error occurred while running the command. Please try again.",
  query: "Please enter appropriate text or parameters.",
  reply: "Please reply to a message or mention a user.",
  success: "Command executed successfully.",
  premium: "This feature is only available for Premium users.",
  coin: "Your coin balance is insufficient to run this command.\nPlease .claim or play a game",
  media: "Please enter a valid media type.",
  main: "This feature is currently under maintenance or development by the owner"
}

// ─── Greeting Helper ──────────────────────────────
function getGreeting() {
  const hour = moment().tz('Asia/Jakarta').hour()
  if (hour >= 4 && hour < 11) return 'Good Morning 🌄'
  if (hour >= 11 && hour < 15) return 'Good Afternoon 🏙️'
  if (hour >= 15 && hour < 18) return 'Good Evening 🌇'
  return 'Good Night 🌌'
}

// ─── SAFE Folder Size (Windows-friendly) ─────────
function getFolderSize(dirPath) {
  let total = 0
  let files = []

  try {
    files = fs.readdirSync(dirPath)
  } catch (err) {
    return 0
  }

  for (const file of files) {
    const filePath = path.join(dirPath, file)

    const blocked = ['Application Data', 'Local Settings', 'Temp']
    if (blocked.includes(path.basename(filePath))) continue

    let stat
    try {
      stat = fs.statSync(filePath)
    } catch (err) {
      continue
    }

    if (stat.isDirectory()) {
      total += getFolderSize(filePath)
    } else {
      total += stat.size
    }
  }

  return total
}

// ─── Global Greeting Function ─────────────────────
global.getGreet = (pushName = 'User', senderJid) => {
  const greet = getGreeting()
  const user = global.system?.getUser?.(global.sender) || { premium: false }
  const uptime = process.uptime() * 1000
  const userTag = senderJid ? `@${senderJid.split('@')[0]}` : pushName

  // Database size
  let ukDb = '0.00'
  try {
    const db = path.resolve('./lib/database/data.json')
    const stat = fs.statSync(db)
    ukDb = (stat.size / 1024).toFixed(2)
  } catch {}

  let sistem = '0.00'
  try {
    const sistemSize = getFolderSize(process.cwd())
    sistem = (sistemSize / (1024 * 1024)).toFixed(2)
  } catch {}

  global.ukDb = ukDb
  global.sis = sistem

  return (
`╭──〔 👋 Hai ${userTag} 〕──
│
│   ✨ ${greet} ✨
│
│ *User Info*
│ – Name      : ${pushName}
│ – Status    : ${user.premium ? '💎 Premium' : 'Freemium'}
│
│ *Statistics*
│ – Uptime    : ${moment.duration(uptime).humanize()}
│ – Database  : ${ukDb} KB
│ – System    : ${sistem} MB
│ – Library   : Baileys
│
│ *Information*
│ – ⓞ : Owner Only
│ – ℗ : Premium Only
│ – © : Coin
│ – ⓕ : Free
│
╰─〔 ${global.bot.name} 〕

A multifunctional WhatsApp assistant that helps with chatting,
media downloads, fun games, group management, and more! 🚀
${user.premium ? 'Enjoy your premium perks! 💎' : 'Upgrade to premium for more features!'}
`
  )
}