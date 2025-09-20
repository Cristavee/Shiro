import * as baileys from 'baileys-x'
import chalk from 'chalk'
import pino from 'pino'
import readline from 'readline'
import { Boom } from '@hapi/boom'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { extendHelper } from './lib/helpers.js'
import './config.js'
import handleMessageEvents, { loadAllPlugins } from './handler.js';
import { EventEmitter } from 'events'
import chokidar from 'chokidar'
import qrcode from 'qrcode-terminal'
import db from './lib/db.js'

const { makeWASocket, DisconnectReason, useMultiFileAuthState, makeInMemoryStore } = baileys
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

const question = (text) => new Promise(resolve => {
  rl.question(chalk.blueBright(text) + ' ', answer => resolve(answer))
})

// ===== Fungsi Utama: Memulai Bot =====
async function begin() {
  console.clear()

  const { state, saveCreds } = await useMultiFileAuthState('./session')
  EventEmitter.defaultMaxListeners = 500
  const store = makeInMemoryStore({ logger: pino().silent() })

  const criv = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !global.usePairingCode,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.0.4'],
    keepAliveIntervalMs: 10000,
    getMessage: async (key) => {
      const msg = await store.loadMessage(key.remoteJid, key.id)
      return msg?.message
    }
  })

  store.bind(criv.ev)

  // ===== Penanganan Pairing Code =====
  if (!criv.authState.creds.registered && global.usePairingCode) {
    const phoneNumber = await question('Masukkan nomor WhatsApp Anda: ')
    try {
      const pairCode = await criv.requestPairingCode(phoneNumber, global.cuspair)
      console.log(chalk.green(`Kode Pairing Anda: ${pairCode}`))
    } catch (err) {
      console.error(chalk.red('Gagal meminta pairing code.'), err)
      process.exit(1)
    }
  }

  // ===== Penanganan Koneksi dan Pembaruan =====
  criv.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr && !global.usePairingCode && !criv.authState.creds.registered) {
      console.log(chalk.yellow('📌 Kode QR tersedia! Silakan pindai dari WhatsApp Anda.'))
      qrcode.generate(qr, { small: true })
    }

    extendHelper(criv)

    if (connection === 'open') {
      console.log(chalk.bgGreen.white('Terhubung Berhasil!'))
      loadAllPlugins()
      console.clear()
      criv.ev.on('messages.upsert', handleMessageEvents.bind(null, criv))
    } else if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

      if (reason === DisconnectReason.badSession || reason === DisconnectReason.loggedOut) {
        console.log(chalk.red('Sesi tidak valid/keluar. Menghapus folder sesi dan memulai ulang.'))
        fs.rmSync(path.resolve(__dirname, 'session'), { recursive: true, force: true })
        process.exit(1)
      } else if (
        [
          DisconnectReason.restartRequired,
          DisconnectReason.connectionClosed,
          DisconnectReason.connectionLost
        ].includes(reason)
      ) {
        console.log(chalk.yellow('Koneksi terputus. Mencoba terhubung kembali...'))
        begin()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(chalk.yellow('Koneksi digantikan oleh sesi baru. Bot terus berjalan.'))
      } else {
        console.log(chalk.yellow(`Koneksi terputus (${reason}). Mencoba terhubung kembali...`))
        begin()
      }
    }
  })

  criv.ev.on('creds.update', saveCreds)
  return criv
}

// ===== Reload Otomatis untuk File-file Penting =====
const watchFiles = [
  path.resolve(__dirname, 'lib'),
  path.resolve(__dirname, 'handler.js'),
  path.resolve(__dirname, 'config.js')
]

chokidar.watch(watchFiles, {
  ignored: (filePath) => filePath.includes('lib/database/data.json') || /(^|[\/\\])\../.test(filePath),
  persistent: true,
  ignoreInitial: true
}).on('change', async (filePath) => {
  console.log(chalk.magenta(`🔄 Perubahan terdeteksi: ${path.basename(filePath)}`))
    const module = await import(`${filePath}?update=${Date.now()}`)
    if (filePath.endsWith('handler.js')) {
      handleMessageEvents = module.default
      console.log(chalk.green('✅ handler.js dimuat ulang.'))
    } else if (filePath.endsWith('config.js')) {
      console.log(chalk.green('✅ config.js dimuat ulang.'))
    } else if (filePath.includes('lib')) {
      console.log(chalk.green(`✅ Pustaka diperbarui: ${path.basename(filePath)}`))
    }
  }
)

begin()

process.on('uncaughtException', (err) => {
  console.error(chalk.red('❌ Pengecualian Tak Terduga (Uncaught Exception):'), err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Penolakan Tak Terkelola (Unhandled Rejection):'), reason)
})
