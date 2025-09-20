import * as baileys from 'baileys-x'
import chalk from 'chalk'
import pino from 'pino'
import readline from 'readline'
import { Boom } from '@hapi/boom'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { extendHelper } from './lib/helpers.js'
import './config.js'
import handleMessageEvents from './handler.js'
import { EventEmitter } from 'events'
import system from './lib/system.js'
import chokidar from 'chokidar'
import qrcode from 'qrcode-terminal'
import db from './lib/db.js'

const { makeWASocket, DisconnectReason, useMultiFileAuthState, makeInMemoryStore } = baileys
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
const question = (text) => new Promise(resolve => {
  process.stdout.write(chalk.blueBright(text) + ' ')
  rl.question('', answer => resolve(answer))
})

// ===== Main function =====
async function begin() {
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
      if (msg) return msg
    }
  })

  store.bind(criv.ev)

  // ===== Pairing code prompt =====
  if (!criv.authState.creds.registered && global.usePairingCode) {
    const phoneNumber = await question('Enter your WhatsApp number: ')
    const pairCode = await criv.requestPairingCode(phoneNumber, global.cuspair)
    console.log(chalk.green(`Your Pairing Code: ${pairCode}`))
  }

  // ===== Connection update handler =====
  criv.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr && !global.usePairingCode && !criv.authState.creds.registered) {
      console.log(chalk.yellow('📌 QR Code is available! Please scan it from your WhatsApp.'))
      qrcode.generate(qr, { small: true })
    }

    extendHelper(criv)

    if (connection === 'open') {
      console.log(chalk.bgGray('Connected Successfully!'))
      criv.ev.on('messages.upsert', handleMessageEvents.bind(null, criv))
    } else if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode

      if (reason === DisconnectReason.badSession || reason === DisconnectReason.loggedOut) {
        console.log(chalk.red('Invalid/Logged out session. Delete session folder and restart.'))
        fs.rmSync(path.resolve(__dirname, 'session'), { recursive: true, force: true })
        process.exit(1)
      } else if (
        reason === DisconnectReason.restartRequired ||
        reason === DisconnectReason.connectionClosed ||
        reason === DisconnectReason.connectionLost
      ) {
        console.log(chalk.yellow('Connection lost. Retrying...'))
        begin()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(chalk.yellow('Connection replaced by a new session. Bot keeps running.'))
      } else {
        console.log(chalk.yellow(`Connection disconnected (${reason}). Retrying...`))
        begin()
      }
    }
  })

  criv.ev.on('creds.update', saveCreds)
  return criv
}

// ===== Auto Reload Crucial Files =====
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
  console.log(chalk.magenta(`🔄 File changed: ${filePath}`))
  try {
    const fileUrl = pathToFileURL(filePath).href
    const module = await import(`${fileUrl}?update=${Date.now()}`)
    if (filePath.endsWith('handler.js')) {
      handleMessageEvents = module.default
      console.log(chalk.green('✅ handler.js reloaded'))
    } else if (filePath.endsWith('config.js')) {
      console.log(chalk.green('✅ config.js reloaded'))
    } else if (filePath.includes('lib')) {
      console.log(chalk.green(`✅ Library updated: ${path.basename(filePath)}`))
    }
  } catch (err) {
    console.error(chalk.red(`❌ Failed to reload ${filePath}:`), err)
  }
})

begin()

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason)
})