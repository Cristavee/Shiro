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
import handleMessageEvents from './handler.js'
import { EventEmitter } from 'events'
import system from './lib/system.js'
import chokidar from 'chokidar'
import qrcode from 'qrcode-terminal'

const { makeWASocket, DisconnectReason, useMultiFileAuthState, makeInMemoryStore } = baileys

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

function question(text) {
  return new Promise(resolve => {
    process.stdout.write(chalk.blueBright(text) + ' ')
    rl.question('', answer => resolve(answer))
  })
}

// ===== Main function =====
async function begin() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')
  EventEmitter.defaultMaxListeners = 500 
  const store = makeInMemoryStore({ logger: pino().silent() });

  const criv = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !global.usePairingCode,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.0.4'],
    keepAliveIntervalMs: 10000,
    getMessage: async (key) => {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      if (msg) return msg;
    }
  })

  store.bind(criv.ev)
  extendHelper(criv)
  
  // ===== Pairing code prompt =====
  if (!criv.authState.creds.registered) {
    if (global.usePairingCode) {
      const phoneNumber = await question('Enter your WhatsApp number: ')
      const pairCode = await criv.requestPairingCode(phoneNumber, global.cuspair)
      console.log(chalk.green(`Your Pairing Code: ${pairCode}`))
    }
  }
    
  // ===== Connection update handler =====
  criv.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !global.usePairingCode && !criv.authState.creds.registered) {
      console.log(chalk.yellow('📌 QR Code is available! Please scan it from your WhatsApp.'))
      qrcode.generate(qr, { small: true }) 
    }

    if (connection === 'open') {
      console.log(chalk.bgGray('Connected Successfully!'))
      criv.ev.on('messages.upsert', handleMessageEvents.bind(null, criv))

    } else if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

      if (reason === DisconnectReason.badSession) {  
        console.log(chalk.red('Invalid session. Delete the session folder and restart.'))
        fs.rmSync(path.resolve(__dirname, 'session'), { recursive: true, force: true })  
        process.exit(1)  

      } else if (reason === DisconnectReason.loggedOut) {  
        console.log(chalk.red('Logged out. Delete the session folder and restart.'))
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

  criv.public = true // ALLOW EVERYONE TO USE 
  criv.private = false // PERSONAL CHAT ONLY
  criv.resMe = false // BOT RESPONSE ITSELF 
  criv.lang = 'indonesia' // DEFAULT LANG FOR SOME FEATURE 
    
  return criv
}

begin() 
