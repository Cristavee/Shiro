/*
 * by Cristave 2025
 * Indonesia
 */

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import util from 'util'
import { exec, execSync } from 'child_process'
import chalk from 'chalk'
import chokidar from 'chokidar'
import * as helpers from './lib/helpers.js'
import system from './lib/system.js'
import './config.js'
import yts from 'yt-search'
import { handleReplyGame } from './lib/game.js'
import moment from 'moment-timezone'
import db from './lib/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pluginsDir = path.join(__dirname, 'plugins')

const cooldowns = new Map()
const spamMap = new Map()
const SPAM_THRESHOLD = 5
const SPAM_INTERVAL = 5000
const gamePlugins = {};
const activeGameTimeouts = {}
const lastActivity = new Map()
const ERROR_LOG_FILE = path.resolve(__dirname, './error.log')

if (!global.processedMessageIds) global.processedMessageIds = new Set()
const MESSAGE_ID_LIFESPAN = 5000

global.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
global.sleep = global.delay

function getMediaType(message) {
	if (!message || typeof message !== 'object') return null
	return Object.keys(message)[0] || null
}

function logCommand({
	command = 'Unknown',
	sender,
	name = 'No Name',
	chatName = 'Unknown',
	isGroup
}) {
	if (!command) return
	const phone = sender.split('@')[0]
	const now = moment().tz('Asia/Jakarta').format('DD MMMM YYYY â€¢ HH:mm:ss')

	const cmd = chalk.cyanBright(command)
	const user = chalk.greenBright(`${phone} (${name})`)
	const context = isGroup ?
		chalk.magentaBright(`Group: ${chatName}`) :
		chalk.gray(`Private: ${chatName}`)
	const time = chalk.yellowBright(now)

	const line = chalk.gray('└' + '─'.repeat(30))

  console.log(chalk.gray('\n\n\n┌──「 📩 Command Log 」'))
  console.log(`│ 🧾 Command   : ${cmd}`)
  console.log(`│ 👤 User      : ${user}`)
  console.log(`│ 🌐 Context   : ${context}`)
  console.log(`│ 🕒 Time      : ${time}`)
  console.log(line)
}

function logErrorToFile(error) {
	const timestamp = new Date().toISOString()
	const errorMessage = `[${timestamp}] ${error.stack || error.message}\n\n\n`
	fs.appendFileSync(ERROR_LOG_FILE, errorMessage, 'utf8')
	console.error(chalk.red(`Error logged to ${ERROR_LOG_FILE}`));
}

function updateLastActivity(senderId) {
	lastActivity.set(senderId, Date.now())
}

function isSpamming(senderId, command) {
	const key = `${senderId}:${command}`
	const now = Date.now()
	const spamData = spamMap.get(key) || {
		count: 0,
		lastTime: 0
	}

	if (now - spamData.lastTime < SPAM_INTERVAL) {
		spamData.count++
	} else {
		spamData.count = 1
	}
	spamData.lastTime = now
	spamMap.set(key, spamData)

	return spamData.count >= SPAM_THRESHOLD
}

if (!global.plugins) {
	global.plugins = {};
}

async function loadPlugin(filePath) {
	try {
		const pluginModule = await import(pathToFileURL(filePath).href + `?update=${Date.now()}`);
		const plugin = pluginModule.default;

		if (plugin && plugin.command && Array.isArray(plugin.command)) {
			for (const cmd of plugin.command) {
				global.plugins[cmd.toLowerCase()] = plugin;
				global.plugins[cmd.toLowerCase()].filePath = filePath;
			}
			if (typeof plugin.onMessage === 'function') {
				gamePlugins[plugin.command[0].toLowerCase()] = plugin;
			}
			console.log(chalk.hex('#B2F2BB')(`Plugin: ${path.basename(filePath)}  - `) + chalk.gray(`command: [ ${plugin.command.join(' - ')} ]`));
			return true
		} else {
			console.warn(`! Plugin '${path.basename(filePath)}' skipped: No 'command' property or it is not an array.`);
			return false;
		}
	} catch (e) {
		console.error(chalk.red(` Failed to load plugin '${path.basename(filePath)}':`), e);
		logErrorToFile(e);
		return false;
	}
}

async function loadAllPlugins() {
	console.log(chalk.yellow('Reloading all plugins...'));
	global.plugins = {};
	Object.keys(gamePlugins).forEach(key => delete gamePlugins[key]);

	try {
		const items = fs.readdirSync(pluginsDir);
		let totalLoaded = 0;

		for (const item of items) {
			const itemPath = path.join(pluginsDir, item);
			const stat = fs.statSync(itemPath);

			if (stat.isDirectory()) {
				const pluginFiles = fs.readdirSync(itemPath).filter(file => file.endsWith('.js'));
				for (const file of pluginFiles) {
					const filePath = path.join(itemPath, file);
					const loaded = await loadPlugin(filePath);
					if (loaded) {
						totalLoaded++;
					}
				}
			} else if (stat.isFile() && item.endsWith('.js')) {
				const loaded = await loadPlugin(itemPath);
				if (loaded) {
					totalLoaded++;
				}
			}
		}
		global.totalFeature = totalLoaded;
		console.log(chalk.green(`All plugins finished loading. Total features: ${totalLoaded}`));
	} catch (dirError) {
		console.error(chalk.red(`Failed to read plugin directory '${pluginsDir}':`), dirError)
		logErrorToFile(dirError)
	}
}

loadAllPlugins()

async function error(m, criv, err = global.msg.error) {
   if (m.quoted) {
    await criv.sendMessage(global.owner, { text: err }, { quoted: m })
  } else {
        await criv.sendMessage(global.owner, { text: err })
    }
}

function checkAccess(plugin, {
	isGroup,
	isAdmin,
	isBotAdmin,
	isOwner,
	sender,
	system
}) {
	const opts = {
		owner: !!plugin.owner,
		group: !!plugin.group,
		private: !!plugin.private,
		premium: !!plugin.premium,
		botAdmin: !!plugin.botAdmin,
		admin: !!plugin.admin,
		coin: plugin.coin || 0
	}

	// âœ… Check banned status
	if (system.isUserBanned(sender)) return global.msg.banned

	// âœ… Owner only
	if (opts.owner && !isOwner) return global.msg.owner

	// âœ… Group / Private
	if (opts.group && !isGroup) return global.msg.group
	if (opts.private && isGroup) return global.msg.private

	// âœ… Premium only
	if (opts.premium && !isOwner && !system.isPremium(sender)) return global.msg.premium

	// âœ… Coin requirement 
	if (opts.coin > 0) {
		const userCoin = system.getCoin(sender)
		if (userCoin < opts.coin) return global.msg.coin
	}

	// âœ… Group-only checks
	if (isGroup) {
		if (opts.botAdmin && !isBotAdmin) return global.msg.botAdmin
		if (opts.admin && !isAdmin) return global.msg.admin
	}

	// âœ… Warn limit 
	if (system.getWarn(sender) >= 3) return global.msg.warn

	// âœ… All checks passed
	return null
}


chokidar.watch(pluginsDir, {
		ignored: /(^|[\/\\])\../,
		persistent: true,
		ignoreInitial: true
	})
	.on('change', async p => {
		console.log(chalk.magenta(`Plugin changed: ${p}. Reloading...`));
		if (fs.statSync(p).isFile() && p.endsWith('.js')) {
			const absolutePath = path.resolve(p);
			let wasLoaded = false;
			for (const cmd in global.plugins) {
				if (global.plugins[cmd]?.filePath && path.resolve(global.plugins[cmd].filePath) === absolutePath) {
					wasLoaded = true;
					delete global.plugins[cmd];
				}
			}

			const loaded = await loadPlugin(absolutePath);

			if (loaded && !wasLoaded) {
				global.totalFeature++;
			} else if (!loaded && wasLoaded) {
				global.totalFeature--;
			}

			if (loaded) {
				console.log(chalk.green('Reloaded:'), path.basename(absolutePath));
			} else {
				console.warn(chalk.yellow(`No command in ${path.basename(absolutePath)} on reload or an error occurred.`));
			}
		} else {
			loadAllPlugins();
		}
	})
	.on('add', async p => {
		console.log(chalk.magenta(`New plugin added: ${p}. Reloading...`));
		if (fs.statSync(p).isFile() && p.endsWith('.js')) {
			const absolutePath = path.resolve(p);
			const loaded = await loadPlugin(absolutePath);
			if (loaded) {
				global.totalFeature++;
			}
		} else {
			loadAllPlugins();
		}
	})
	.on('unlink', p => {
		console.log(chalk.magenta(`Plugin deleted: ${p}. Reloading...`));
		if (fs.statSync(p).isFile() && p.endsWith('.js')) {
			const absolutePath = path.resolve(p);
			let wasLoaded = false;

			for (const cmd in global.plugins) {
				if (global.plugins[cmd]?.filePath && path.resolve(global.plugins[cmd].filePath) === absolutePath) {
					wasLoaded = true;
					delete global.plugins[cmd];
					console.log(chalk.red(`  -> Deleted: ${cmd}`));
				}
			}

			if (wasLoaded) {
				global.totalFeature--;
			}
		} else {
			loadAllPlugins();
		}
	});

async function cleanupExpiredGames() {
	if (!system.db) return
	if (!system.db.data) system.db.data = {
		games: {}
	}
	try {
		if (system.db.read) await system.db.read()
	} catch (err) {
		console.error('Failed to read database:', err)
		system.db.data = {
			games: {}
		}
	}

	const now = Date.now()
	let changed = false

	if (!system.db.data.games) system.db.data.games = {}

	for (const gameId in system.db.data.games) {
		const game = system.db.data.games[gameId];
		if (game.active && game.endTime && now > game.endTime) {
			console.log(`Cleaning up expired game: ${gameId}`);
			delete system.db.data.games[gameId];
			if (activeGameTimeouts[gameId]) {
				clearTimeout(activeGameTimeouts[gameId]);
				delete activeGameTimeouts[gameId];
			}
			changed = true;
		}
	}

	if (changed && system.saveDb) {
		try {
			await system.saveDb();
		} catch (err) {
			console.error('Failed to save database:', err);
		}
	}
}

setInterval(cleanupExpiredGames, 60 * 1000);

const groupMetaCache = new Map();
async function getGroupMeta(criv, chatId) {
 if (groupMetaCache.has(chatId)) return groupMetaCache.get(chatId);
 const data = await criv.groupMetadata(chatId);
 groupMetaCache.set(chatId, data);
 setTimeout(() => groupMetaCache.delete(chatId), 60_000);
 return data;
}

export default (criv) => {
   criv.decodeJid = helpers.decodeJid
   criv.plugins = global.plugins
    
    
const prop = {
  public:        () => db.data.system.public,
  main:          () => db.data.system.maintenance,
  private:       () => !db.data.system.public,
  resMe:         () => db.data.system.responseToMe,
  lang:          () => db.data.system.lang,
  autoAi:        () => db.data.system.autoAI,
  autoRead:      () => db.data.system.autoRead,
  like:          () => db.data.system.like
}

for (const [key, getter] of Object.entries(prop)) {
  if (!Object.getOwnPropertyDescriptor(criv, key)) {
    Object.defineProperty(criv, key, {
      get: getter,
      configurable: true
    })
  }
}

	criv.ev.on('messages.upsert', async (chatUpdate) => {
		try {
			const rawMsg = chatUpdate.messages?.[0]
			if (!rawMsg?.message) return
			const realPushName = rawMsg.pushName || 'Unknown'
			const m = rawMsg

			m.chat = helpers.decodeJid(m.key.remoteJid || m.remoteJid || '')

			const {
				messages,
				type
			} = chatUpdate;


			if (m.key.id && global.processedMessageIds.has(m.key.id)) return;

			global.processedMessageIds.add(m.key.id);
			setTimeout(() => global.processedMessageIds.delete(m.key.id), MESSAGE_ID_LIFESPAN);

			m.key = m.key || {
				remoteJid: m.remoteJid || '',
				id: m.id || '',
				fromMe: false
			}
			const mtype = Object.keys(m.message)[0]
			const content = m.message[mtype]
			m.image = mtype === 'imageMessage' ? content : null
			m.video = mtype === 'videoMessage' ? content : null
			m.audio = mtype === 'audioMessage' ? content : null
			m.document = mtype === 'documentMessage' ? content : null

			const msgContent = Object.values(m.message || {})[0]
			const context = msgContent?.contextInfo

			m.quoted = (context?.quotedMessage || null) ? {
				id: context.stanzaId,
				chat: context.remoteJid,
				sender: context.participant ? helpers.decodeJid(context.participant) : m.key.remoteJid,
				fromMe: context.fromMe || false,
				message: context.quotedMessage,
				key: {
					remoteJid: context.remoteJid,
					id: context.stanzaId,
					participant: context.participant,
				},

				mimetype: Object.values(context.quotedMessage)?.[0]?.mimetype || getMediaType(context.quotedMessage),
				mediaType: Object.keys(context.quotedMessage)[0],
				isSticker: !!context.quotedMessage.stickerMessage,
				isImage: !!context.quotedMessage.imageMessage,
				isVideo: !!context.quotedMessage.videoMessage,
				isAudio: !!context.quotedMessage.audioMessage,
				isDocument: !!context.quotedMessage.documentMessage,
				isMedia: ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].some(t => t in context.quotedMessage),

				async download() {
					const type = Object.keys(context.quotedMessage)[0]
					const mediaObj = context.quotedMessage[type]
					if (mediaObj?.url || mediaObj?.stream || this.isMedia) {
						return await criv.downloadMediaMessage({
							key: this.key,
							message: context.quotedMessage
						})
					}
					return null
				},
				text: context.quotedMessage.conversation ||
					context.quotedMessage.extendedTextMessage?.text ||
					context.quotedMessage.imageMessage?.caption ||
					context.quotedMessage.videoMessage?.caption ||
					context.quotedMessage.documentMessage?.caption ||
					context.quotedMessage.buttonsResponseMessage?.selectedButtonId ||
					context.quotedMessage.templateButtonReplyMessage?.selectedId ||
					context.quotedMessage.listResponseMessage?.singleSelectReply?.selectedRowId || ''
			} : null

			if (!m.quoted && m.message) {
				const type = Object.keys(m.message).find(v => ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(v))
				if (type) {
					const mediaObj = m.message[type]
					m.mimetype = mediaObj?.mimetype
					m.mediaType = type
					m.isMedia = true

					m.download = async () => {
						return await criv.downloadMediaMessage(m)
					}

					m.text =
						mediaObj?.caption ||
						m.message.conversation ||
						''
				}
			}

			const isGame = await handleReplyGame(m)
			if (isGame) return

			let body =
				m.text?.toLowerCase() ||
				m.message?.conversation?.toLowerCase() ||
				m.message?.extendedTextMessage?.text?.toLowerCase() ||
				''

			if (mtype === 'viewOnceMessageV2' || mtype === 'viewOnceMessageV2Extension') {
				const inner = m.message[mtype].message
				mtype = Object.keys(inner)[0]
				m.message = inner
			}

			switch (mtype) {
				case 'conversation':
					body = m.message.conversation;
					break
				case 'extendedTextMessage':
					body = m.message.extendedTextMessage?.text || '';
					break
				case 'imageMessage':
					body = m.message.imageMessage?.caption || '';
					break
				case 'videoMessage':
					body = m.message.videoMessage?.caption || '';
					break
				case 'buttonsResponseMessage':
					body = m.message.buttonsResponseMessage?.selectedButtonId || '';
					break
				case 'templateButtonReplyMessage':
					body = m.message.templateButtonReplyMessage?.selectedId || '';
					break
				case 'listResponseMessage':
					body = m.message.listResponseMessage?.singleSelectReply?.selectedRowId || '';
					break
				case 'stickerMessage':
					body = '[Sticker]';
					break
				case 'audioMessage':
					body = '[Audio]';
					break
				case 'documentMessage':
					body = '[Document]';
					break
				case 'locationMessage':
					body = '[Location]';
					break
				case 'contactMessage':
					body = '[Contact]';
					break
				case 'reactionMessage':
					body = m.message.reactionMessage?.text || '[Reaction]';
					break
				default:
					break
			}

			if (!body && m.quoted?.message) {
				let qmtype = Object.keys(m.quoted.message)[0]

				if (qmtype === 'viewOnceMessageV2' || qmtype === 'viewOnceMessageV2Extension') {
					const inner = m.quoted.message[qmtype].message
					qmtype = Object.keys(inner)[0]
					m.quoted.message = inner
				}

				switch (qmtype) {
					case 'conversation':
						body = m.quoted.message.conversation;
						break
					case 'extendedTextMessage':
						body = m.quoted.message.extendedTextMessage?.text || '';
						break
					case 'imageMessage':
						body = m.quoted.message.imageMessage?.caption || '';
						break
					case 'videoMessage':
						body = m.quoted.message.videoMessage?.caption || '';
						break
					case 'stickerMessage':
						body = '[Sticker Replied]';
						break
					case 'audioMessage':
						body = '[Audio Replied]';
						break
					case 'documentMessage':
						body = '[Document Replied]';
						break
					case 'locationMessage':
						body = '[Location Replied]';
						break
					case 'contactMessage':
						body = '[Contact Replied]';
						break
					case 'buttonsResponseMessage':
						body = m.quoted.message.buttonsResponseMessage?.selectedButtonId || '[Button Replied]';
						break
					case 'templateButtonReplyMessage':
						body = m.quoted.message.templateButtonReplyMessage?.selectedId || '[Template Button Replied]';
						break
					case 'listResponseMessage':
						body = m.quoted.message.listResponseMessage?.singleSelectReply?.selectedRowId || '[List Replied]';
						break
					default:
						break
				}
			}

			if (!body && !m.quoted) return

			if (!global.prefix || !Array.isArray(global.prefix)) global.prefix = ['.']

			const usedPrefix = global.prefix.find(p => body.startsWith(p))
			const isCommand = !!usedPrefix

			const command = isCommand ?
				body.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase() :
				null
			const args = isCommand ? body.trim().split(' ').slice(1) : []
			const text = args.join(' ')

			const from = m.key.remoteJid || '';
			const rawSender = m.key.participant || m.participant || m.key.remoteJid || '';
			const sender = m.key.fromMe ? criv.user?.id.split(':')[0] || '' : rawSender;
			const pushName = m.pushName
			const isGroup = from.endsWith('@g.us')
			const owners = [criv.user?.id, ...(global.owner || [])]
				.filter(Boolean) || global.bot.owner
				.map(jid => helpers.decodeJid(jid))
			const isOwner = db.data.owner.includes(sender.split('@')[0])
			const rawJid = m.sender || m.key?.participant || m.key?.remoteJid || ''
			await system.addUser(rawJid, m.pushName)

			global.system = system
			if (!db.data.owner.includes(global.owner)) await system.addOwner(global.bot.owner)

			const target = helpers.getTarget(m, args)
			const amount = helpers.parseAmount(args)
			const num = sender.split('@')[0]
			const decoded = rawJid ? helpers.safeJidDecode(rawJid) : null
			const user = decoded?.user || rawJid.split('@')[0] || 'unknown_user'
			const readMore = '\u200b'.repeat(5000)
			const getName = async (jid) => {
				try {
					if (typeof criv.getName === 'function') {
						return await criv.getName(jid)
					}
				} catch (e) {
					console.error(chalk.red(`Error getting name for ${jid}:`), e);
				}
				return jid.split('@')[0]
			}
			const mentioned =
				m.quoted?.key?.participant ||
				(Array.isArray(m.message?.extendedTextMessage?.contextInfo?.mentionedJid) ?
					m.message.extendedTextMessage.contextInfo.mentionedJid[0] :
					null) ||
				m.sender;
			const mentionedJids = Array.isArray(m.message?.extendedTextMessage?.contextInfo?.mentionedJid) ? m.message.extendedTextMessage.contextInfo.mentionedJid : [];


			const fakeQuote = {
				key: {
					remoteJid: 'status@broadcast',
					participant: '0@s.whatsapp.net'
				},
				message: {
					extendedTextMessage: {
						text: global.bot.name
					}
				}
			}

			const botNumber = helpers.decodeJid(criv.user?.id || '')
			const isMedia = (mtype === 'imageMessage' || mtype === 'videoMessage' || mtype === 'stickerMessage' || mtype === 'audioMessage' || mtype === 'documentMessage');
			const isImage = mtype === 'imageMessage';
			const isVideo = mtype === 'videoMessage';
			const isAudio = mtype === 'audioMessage';
			const isSticker = mtype === 'stickerMessage';
			const isDocument = mtype === 'documentMessage';
			const isQuotedImage = m.quoted?.mimetype?.startsWith('image') || false;
			const isQuotedVideo = m.quoted?.mimetype?.startsWith('video') || false;
			const isQuotedAudio = m.quoted?.mimetype?.startsWith('audio') || false;
			const isQuotedSticker = m.quoted?.mimetype?.startsWith('sticker') || false;
			const isQuotedDocument = m.quoted?.mimetype?.startsWith('application') || false;
			const q = m.quoted;
			const isBot = m.key.fromMe;
			const commandPrefix = usedPrefix;
			const groupMetadata = isGroup ? await criv.groupMetadata(from) : {};
			const groupAdmins = isGroup ?
				groupMetadata.participants
				.filter(p => p.admin)
				.map(p => helpers.decodeJid(p.jid)) :
				[]
			const isBlocked = system.isUserBanned(sender)
			const isBotAdmin = groupAdmins.includes(botNumber)
			const isAdmin = groupAdmins.includes(sender)
			const quoted = m.quoted
			global.sender = sender
			const currentTime = new Date();
			const timestamp = currentTime.getTime();
			const senderOwner = (m.sender === global.owner[0])
			const formattedTime = currentTime.toLocaleTimeString('id-ID', {
				hour12: false
			});
			const formattedDate = currentTime.toLocaleDateString('id-ID', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
			Object.assign(m, {
				botNumber: botNumber,
				system: system,
				isBot: isBot,
				prefix: global.prefix[0] || '.',
				chat: from,
				target: target,
				amount: amount,
				mention: mentioned,
				from: from,
				sender: num,
				rawSender: sender,
				pushName: pushName,
				body: body,
				args: args,
				command: command,
				text: text,
				readMore: readMore,
				user: user,
				isReply: !!m.quoted,
				isMention: mentionedJids.length > 0,
				mentionedJids: mentionedJids,
				isOwner: isOwner,
				isGroup: isGroup,
				isAdmin: isAdmin,
				isBotAdmin: isBotAdmin,
				fromOwner: senderOwner,
				db: db.data
			});
			m.reply = async (content, options = {}) => {
				if (!criv || !criv.sendMessage || !from) {
					console.error(chalk.red(`[m.reply ERROR] criv, criv.sendMessage, or from is undefined. From: ${from}`));
					logErrorToFile(new Error(`[m.reply ERROR] criv, criv.sendMessage, or from is undefined. From: ${from}`));
					return;
				}

				const defaultOptions = {
					quoted: m
				};
				let messageOptions = {
					...defaultOptions,
					...options
				};

				try {
					if (typeof content === 'string') {
						const textMentions = (content.match(/@(\d+)/g) || []).map(jid => jid.replace('@', '') + '@s.whatsapp.net');
						if (textMentions.length > 0) {
							messageOptions.mentions = [...(messageOptions.mentions || []), ...textMentions];
						}
						await criv.sendMessage(from, {
							text: content,
							...messageOptions
						});
					} else if (content instanceof Buffer) {
						await criv.sendMessage(from, {
							sticker: content,
							...messageOptions
						}, {
							quoted: m
						});
					} else if (typeof content === 'object') {
						await criv.sendMessage(from, {
							...content,
							...messageOptions
						}, {
							quoted: m
						});
					}
				} catch (err) {
					if (err?.message?.includes("rate-overlimit")) {
						console.log("Rate limit detected, waiting 3 seconds then retrying...");
						await new Promise(res => setTimeout(res, 3000));
						return await m.reply(content, options);
					}
					console.error("m.reply error:", err);
					logErrorToFile(err);
                   
				}
			};

			//FILTER
			if (criv.autoRead) {
				for (const msg of chatUpdate.messages) {
					try {
						await criv.readMessages([msg.key])
					} catch (e) {
						console.error('AutoRead error:', e)
					}
				}
			}
			if (criv.main) {
               if (!isOwner && isCommand ) return m.reply(msg.main) }
			if (system.isUserBanned(num)) return
			if (!criv.resMe && m.key.fromMe) return
			if (!criv.public && !isOwner) return
			if (criv.private && from.endsWith('@g.us')) return
			if (isGroup && !isOwner && system.isMuted(m.chat)) return


			if (db.data.confess) {
				for (let sid in db.data.confess) {
					const sess = db.data.confess[sid]
					const fromJid = m.rawSender || sender || (m.key && (m.key.participant || m.key.remoteJid))
					if (!fromJid) continue

					if (m.body && m.body.startsWith('.menfess')) continue

					const msgText = m.message.conversation || ''
					const mtype = Object.keys(m.message || {})[0]
					const isImage = mtype === 'imageMessage'
					const isVideo = mtype === 'videoMessage'
					const isAudio = mtype === 'audioMessage'
					const isDocument = mtype === 'documentMessage'
					const isSticker = mtype === 'stickerMessage'

					try {
						const sendOptions = (extra = {}) => ({
							contextInfo: {
								isForwarded: true
							},
							...extra
						})

						// Message from sender -> recipient
						if (fromJid === sess.sender) {
							const label = `*${sess.alias}:* ${msgText}`.trim()
							const mediaBuffer = m.isMedia ?
								await (typeof m.download === 'function' ? m.download() : criv.downloadMediaMessage(m)) :
								null

							if (m.isMedia && mediaBuffer) {
								if (isImage) await criv.sendMessage(sess.recipient, {
									image: mediaBuffer,
									caption: label,
									...sendOptions()
								})
								else if (isVideo) await criv.sendMessage(sess.recipient, {
									video: mediaBuffer,
									caption: label,
									...sendOptions()
								})
								else if (isAudio) {
									if (label) await criv.sendMessage(sess.recipient, {
										text: label,
										...sendOptions()
									})
									await criv.sendMessage(sess.recipient, {
										audio: mediaBuffer,
										mimetype: m.mimetype || 'audio/mpeg',
										...sendOptions()
									})
								} else if (isDocument) await criv.sendMessage(sess.recipient, {
									document: mediaBuffer,
									mimetype: m.mimetype || 'application/octet-stream',
									fileName: 'file',
									caption: label,
									...sendOptions()
								})
								else if (isSticker) {
									await criv.sendMessage(sess.recipient, {
										sticker: mediaBuffer,
										...sendOptions()
									})
									if (label) await criv.sendMessage(sess.recipient, {
										text: label,
										...sendOptions()
									})
								} else await criv.sendMessage(sess.recipient, {
									text: label,
									...sendOptions()
								})
							} else {
								await criv.sendMessage(sess.recipient, {
									text: label,
									...sendOptions()
								})
							}
						}

						// Message from recipient -> sender
						else if (fromJid === sess.recipient) {
							const label = `📝 *Reply from ${sess.recipient.split('@')[0]}:* ${msgText}`.trim()
							const mediaBuffer = m.isMedia ?
								await (typeof m.download === 'function' ? m.download() : criv.downloadMediaMessage(m)) :
								null

							if (m.isMedia && mediaBuffer) {
								if (isImage) await criv.sendMessage(sess.sender, {
									image: mediaBuffer,
									caption: label,
									...sendOptions()
								})
								else if (isVideo) await criv.sendMessage(sess.sender, {
									video: mediaBuffer,
									caption: label,
									...sendOptions()
								})
								else if (isAudio) {
									if (label) await criv.sendMessage(sess.sender, {
										text: label,
										...sendOptions()
									})
									await criv.sendMessage(sess.sender, {
										audio: mediaBuffer,
										mimetype: m.mimetype || 'audio/mpeg',
										...sendOptions()
									})
								} else if (isDocument) await criv.sendMessage(sess.sender, {
									document: mediaBuffer,
									mimetype: m.mimetype || 'application/octet-stream',
									fileName: 'file',
									caption: label,
									...sendOptions()
								})
								else if (isSticker) {
									await criv.sendMessage(sess.sender, {
										sticker: mediaBuffer,
										...sendOptions()
									})
									if (label) await criv.sendMessage(sess.sender, {
										text: label,
										...sendOptions()
									})
								} else await criv.sendMessage(sess.sender, {
									text: label,
									...sendOptions()
								})
							} else {
								await criv.sendMessage(sess.sender, {
									text: label,
									...sendOptions()
								})
							}
						}
					} catch (err) {
                        error(m, criv, 'Menfess error:\n'+err)
						console.error('[MENFESS][ERROR] failed to forward message', {
							sid,
							err
						})
					}
				}
			}

			db.data.games ||= {}

			// GAME

			const game = db.data.games?.[m.chat]
			if (
				game &&
				game.active &&
				game.gameType &&
				gamePlugins?.[game.gameType] &&
				typeof gamePlugins[game.gameType].onMessage === 'function'
			) {
				try {
					const gamePlugin = gamePlugins[game.gameType]
					await gamePlugin.onMessage(criv, m)
					return
				} catch (e) {
                    error(m, criv, 'Game Error:\n'+e)
					console.error('[Game Error][onMessage]', e)
				}
			}

			if (m.isReply && m.quoted?.id) {
				const allActiveGames = Object.values(system?.db?.data?.games || {})
					.filter(g => g && typeof g === 'object')

				const gameForReply = allActiveGames.find(g =>
					g?.active && g.chatId === from && g.questionMessageId === m.quoted?.id
				)

				if (gameForReply) {
					const gamePlugin = gamePlugins?.[gameForReply.gameType]
					if (gamePlugin && typeof gamePlugin.handleGameReply === 'function') {
						try {
							const gameIsEnded = await gamePlugin.handleGameReply(criv, m, system, gameForReply)
							if (gameIsEnded) {
								delete system.db.data.games[gameForReply.gameId]
								if (activeGameTimeouts?.[gameForReply.gameId]) {
									clearTimeout(activeGameTimeouts[gameForReply.gameId])
									delete activeGameTimeouts[gameForReply.gameId]
								}
							}
							await system.saveDb()
							return
						} catch (e) {
							console.error('[Game Error][handleGameReply]', e)
                            error(m, criv, `Game feature error:\n ${e}`)
						}
					}
				}
			}

			global.lastSave ||= new Map()
			const lastSave = global.lastSave

			if (!lastSave.has(sender) || (Date.now() - lastSave.get(sender)) > 5000) {
				try {
					await system.saveDb()
					lastSave.set(sender, Date.now())
				} catch (e) {
					console.error('[DB Save Error]', e)
				}
			}

			if (command) {
				system.addExp(sender, 5)
				system.addcom(sender)
			}


			if (isSpamming(sender, command)) {
				system.addWarn(sender)
				await m.reply(global.msg.spam);
				return;
			}




			const plugin = global.plugins[command]
			if (plugin) {
				const cooldownKey = sender
				const now = Date.now()
				const cd = plugin.cooldown || 3000

				if (cooldowns.has(cooldownKey)) {
					const expire = cooldowns.get(cooldownKey)
					const remaining = expire - now
					if (remaining > 0) {
						await criv.sendMessage(from, {
							react: {
								text: '💤',
								key: m.key
							}
						})
						return
					}
				}

				cooldowns.set(cooldownKey, now + cd)
				setTimeout(() => cooldowns.delete(cooldownKey), cd)


				const failReason = checkAccess(plugin, {
					isGroup,
					isAdmin,
					isBotAdmin,
					isOwner,
					sender,
					system
				})

				if (failReason) {
					await m.reply(failReason)
					await system.saveDb()
					return
				}

				const isStickerCommand = ['stiker', 'sticker', 's'].includes(command);
				const isMediaMessage = ['imageMessage', 'videoMessage'].includes(mtype);

				if (isStickerCommand && isMediaMessage && !m.quoted) {
					try {
						await criv.sendPresenceUpdate('composing', m.chat)
						await plugin.run(criv, {
							m,
							body,
							from,
							args,
							command,
							sender,
							db,
							pushName,
							text,
							greet: global.getGreet(m.pushName),
							isBlocked,

							target,
							amount,
							user,
							helpers,
							mentioned,
							readMore,
							fakeQuote,
							getName,
							delay: global.delay,
							sleep: global.sleep,
							system,
							sourceMessage: m
						});
						await system.addExp(sender, 10);
						await system.saveDb();
						await criv.sendPresenceUpdate('paused', m.chat)
					} catch (pluginError) {
                        const er = `Error running plugin '${command}' (direct media):`
						console.error(chalk.red(er), pluginError);
						logErrorToFile(pluginError);
                        error(m, criv, er+pluginError)
						}
						await system.saveDb();
					return;
				}

				try {
					await criv.sendPresenceUpdate('composing', m.chat)
					await new Promise(resolve => setTimeout(resolve, 100))
					await plugin.run(criv, {
						m,
						body,
						from,
						args,
						command,
						sender,
						pushName,
						text,
						db,
						greet: global.getGreet(m.pushName),
						quoted,
						isBlocked,
						target,
						amount,
						user,
						helpers,
						mentioned,
						readMore,
						fakeQuote,
						getName,
						delay: global.delay,
						sleep: global.sleep,

						system
					})
					await system.addExp(sender, 10)
					await system.saveDb()
				} catch (pluginError) {
					console.error(chalk.red(`Error running plugin '${command}':`), pluginError)
					logErrorToFile(pluginError)
                    error(m, criv, pluginError)
					await system.saveDb()
                    }
			}
			await criv.sendPresenceUpdate('paused', m.chat)

			if (m.isOwner) {
				const lowerBody = body.trim().toLowerCase()

				if (lowerBody.startsWith('>')) {
					const commandInput = body.slice(1).trim()
					if (!commandInput) return m.reply('Enter code to evaluate.')

					try {
						const wrappedCode = commandInput.includes('return') ?
							`(async () => { ${commandInput} })()` :
							`(async () => { return ${commandInput} })()`
						let evalResult = await eval(wrappedCode)
						if (typeof evalResult !== 'string') {
							evalResult = util.inspect(evalResult)
						}

						await m.reply(evalResult)
					} catch (e) {
						m
						console.error(chalk.red('Error in eval command:'), e)
						logErrorToFile(e)
						await m.reply('*Error:* \n' + (e.stack || e.toString()))
					}
					return
				}

				if (lowerBody.startsWith('=>')) {
					const command = body.slice(2).trim()
					if (!command) return m.reply('Enter shell command to execute.')

					try {
						const {
							stdout,
							stderr
						} = await util.promisify(exec)(command)
						let response = ''
						if (stdout) response += '*STDOUT:*\n' + stdout + '\n'
						if (stderr) response += '*STDERR:*\n' + stderr + '\n'
						await m.reply(response || 'Command executed without output.')
					} catch (e) {
						console.error(chalk.red('Error in exec command:'), e)
						logErrorToFile(e)
						await m.reply('*Error:* \n' + (e.stack || e.toString()))
					}
					return
				}

				if (lowerBody.startsWith('$')) {
					const command = body.slice(1).trim()
					if (!command) return m.reply('Enter shell command to execute.')

					try {
						const output = execSync(command, {
							encoding: 'utf8',
							stdio: 'pipe'
						})
						await m.reply('*Shell:*\n' + output)
					} catch (e) {
						console.error(chalk.red('Error in shell command:'), e)
						logErrorToFile(e)
						const errorMsg = e.stdout?.toString() || e.stderr?.toString() || e.message
						await m.reply('*Shell Error:* \n' + errorMsg)
					}
					return
				}
			}

			if (criv.autoAi && !isBot) {
				console.log(body)
				const res = await axios.get('https://apidl.asepharyana.tech/api/ai/chatgpt', {
					params: {
						prompt: `you are a smart and speak ${criv.lang} assistant who is kind and genius and charismatic`,
						text: body
					}
				})
				await m.reply(res.data.result)
			}

			let chatName = m.pushName || 'No Name'
			if (isGroup) {
				try {
					const metadata = await criv.groupMetadata(from)
					chatName = metadata.subject || 'Unnamed Group'
					m.metadata = metadata
				} catch {
					chatName = 'Unreadable Group'
				}
			}

			logCommand({
				command,
				sender,
				name: pushName,
				chatName,
				isGroup
			})

			global.m = m

		} catch (handlerError) {
			console.error(chalk.red(' Error in main messages.upsert handler:'), handlerError)

			logErrorToFile(handlerError)
		}
	})
}
const m = global.m
export {
	m
}