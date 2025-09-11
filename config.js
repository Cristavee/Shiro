import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'

// ─── Bot Settings ─────────────────────────────────
global.usePairingCode = true // true = pairing code, false = QR
global.cuspair = 'AAAAAAAA' // CUSTOM PAIRING CODE (MUST BE 8 DIGITS)
global.bot = {
  name: '', // UR BOT NAME
  owner: '', // UR NUMBER
  ownerName: '', // UR NAME
  full: '' // UR BOT FULL NAME / SEC NAME
}
global.thumb = 'https://pomf2.lain.la/f/10xr5ka8.png' // THUMBNAIL URL

// ─── Sticker ──────────────────────────────────

global.pack = 'Shiro Sticker'
global.author = 'WhatsApp Bot'

// ─── Owner List ──────────────────────────────────
global.owner = [`${global.bot.owner}@s.whatsapp.net`]

// ─── Command Prefix ───────────────────────────────
global.prefix = ['.', '!', '/', ',']

// ─── Social Media ──────────────────────────────────
global.ig = '' // fill if available
global.wa = '' // fill if available
global.git = '' // fill if available
global.yt = '' // fill if available
global.fb = '' // fill if available

// ─── Default Bot Responses ────────────────────────────
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

// ─── API Key (For Future Project)───────────────────────

// ─── Dynamic Greeting Function ─────────────────────────
function getGreeting() {
  const hour = moment().tz('Asia/Jakarta').hour()
  if (hour >= 4 && hour < 11) return 'Good Morning 🌄'
  if (hour >= 11 && hour < 15) return 'Good Afternoon 🏙️'
  if (hour >= 15 && hour < 18) return 'Good Evening 🌇'
  return 'Good Night 🌌'
}

global.getGreet = (pushName = 'User', senderJid) => {
   const greet = getGreeting()
  const user = global.system.getUser(global.sender)
  const uptime = process.uptime() * 1000
  const userTag = senderJid ? `@${senderJid.split('@')[0]}` : pushName
  const like = global.system.getLike()

function getFolderSize(dirPath) {
  let total = 0

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      total += getFolderSize(filePath)
    } else {
      total += stat.size
    }
  }

  return total
}

const db = path.resolve('./lib/database/data.json')
const stat = fs.statSync(db)
const ukDb = (stat.size / 1024).toFixed(2)

const sis = path.resolve('../')
const sistemSize = getFolderSize(sis)
const sistem = (sistemSize / (1024 * 1024)).toFixed(2) 
global.ukDb = ukDb
global.sis = sistem
  return (
`👋 Hi ${userTag}, ${greet}

> Name\t\t: ${pushName}
> Status\t\t: ${user.premium ? '💎 Premium' : 'Freemium'}

 Statistics  :
> Uptime\t\t: ${moment.duration(uptime).humanize()}
> Database\t: ${ukDb} KB
> Sistem\t\t: ${sistem} MB
> Library\t: Baileys-x
> Total Like\t: *${like}* ♥️

 Information:
> ⓞ\t: Owner Only
> ℗\t: Premium Only
> ©\t: Coin
> ⓕ\t: Free

️ ${global.bot.name} is a multifunctional WhatsApp assistant designed to help with chatting, downloading media, playing fun games, managing groups, and providing useful tools,while also supporting premium features for advanced users.`
  )
}