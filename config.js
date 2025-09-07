import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'

// ─── Pengaturan Bot ─────────────────────────────────
global.usePairingCode = true // true = pairing code, false = QR
global.cuspair = 'AAAAAAAA'
global.bot = {
  name: 'Shiro',
  owner: '6285932203366',
  ownerName: 'Cristave',
  dummy: '12345678910@s.whatsapp.net',
  full: 'Shirotaka'
}
global.thumb = 'https://pomf2.lain.la/f/10xr5ka8.png'
global.responseToBot = false

// ─── Sticker ──────────────────────────────────

global.pack = 'Shiro Sticker'
global.author = 'WhatsApp Bot'

// ─── Daftar Owner ──────────────────────────────────
global.owner = [`${global.bot.owner}@s.whatsapp.net`]

// ─── Prefix Perintah ───────────────────────────────
global.prefix = ['.', '!', '/', ',']

// ─── Sosial Media ──────────────────────────────────
global.ig = ''
global.wa = ''
global.git = ''
global.yt = '' // isi jika ada
global.fb = '' // isi jika ada

// ─── Respon Bot Default ────────────────────────────
global.msg = {
  owner: "Perintah ini hanya dapat digunakan oleh Owner.",
  admin: "Perintah ini hanya dapat digunakan oleh Admin grup.",
  botAdmin: "Bot perlu menjadi Admin untuk menjalankan perintah ini.",
  group: "Perintah ini hanya dapat digunakan di dalam grup ini.",
  private: "Perintah ini hanya dapat digunakan di chat pribadi.",
  error: "Terjadi kesalahan saat menjalankan perintah. Silakan coba kembali.",
  query: "Mohon masukkan teks atau parameter yang sesuai.",
  reply: "Silakan balas pesan atau mention pengguna.",
  success: "Perintah berhasil dijalankan.",
  premium: "Fitur ini hanya tersedia untuk pengguna Premium.",
  coin: "Saldo koin kamu tidak mencukupi untuk menjalankan perintah ini\nSilahkan .claim atau mainkan game",
  media: "Masukan tipe media yang valid.",
  main: "Fitur ini dalam proses perawatan atau pengembangan oleh owner"
}

// ─── API Key ───────────────────────────────────────

// ─── Fungsi Sapaan Dinamis ─────────────────────────
function getGreeting() {
  const hour = moment().tz('Asia/Jakarta').hour()
  if (hour >= 4 && hour < 11) return 'Selamat Pagi 🌄'
  if (hour >= 11 && hour < 15) return 'Selamat Siang 🏙️'
  if (hour >= 15 && hour < 18) return 'Selamat Sore 🌇'
  return 'Selamat Malam 🌌'
}

global.getGreet = (pushName = 'Pengguna', senderJid) => {
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
`👋 Hai ${userTag}, ${greet}

> Nama     : ${pushName}
> Status   : ${user.premium ? '💎 Premium' : 'Freemium'}

 Statistik   :
> Uptime     : ${moment.duration(uptime).humanize()}
> Database   : ${ukDb} KB
> Sistem     : ${sistem} MB
> Library    : Baileys-x
> Total Like : *${like}* ♥️

 Keterangan:
> ⓞ : Owner Only
> ℗  : Premium Only
> ©  : Coin
> ⓕ : Free

*${global.bot.name}* bisa membantumu melakukan banyak hal, namun masih dalam tahap pengembangan.`.trim()
  )
}