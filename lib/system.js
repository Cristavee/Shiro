import db from './db.js'
import moment from 'moment-timezone'
import chalk from 'chalk'
import {
	m
} from '../handler.js'

function sanitizeId(rawId) {
	if (!rawId) return null
	if (rawId.startsWith('120')) return null // hindari ID grup WA
	let id = String(rawId)
	if (id.includes(':')) id = id.split(':')[0]
	if (id.includes('@')) id = id.split('@')[0]
	if (!/^\d{8,15}$/.test(id)) return null
	return id
}

const system = {
	addUser(rawId, pushName) {
		db.data.users ||= {}
		const id = sanitizeId(rawId)
		if (!id) return null

		if (!db.data.users[id]) {
			db.data.users[id] = {
				coin: 100,
				premium: false,
				joinedAt: Date.now(),
				exp: 0,
				level: 1,
				bio: 'Belum disetel. Gunakan .setbio [bio]',
				isBanned: false,
				warn: 0,
				lastMessage: 0,
				commandCount: 0,
				lastClaimed: {
					daily: 0,
					weekly: 0,
					monthly: 0,
					yearly: 0
				},
				name: pushName || 'Unknown',
				status: null,
				gameStats: {
					totalPlayed: 0,
					totalWins: 0
				}
			}
			console.log(chalk.green(`✅ Berhasil menambah user: ${pushName || 'Unknown'}, Nomor: ${id}`))
		} else {
			if (pushName?.trim() && db.data.users[id].name !== pushName) {
				console.log(chalk.yellow(`🔄 Update nama user: ${db.data.users[id].name} => ${pushName}`))
				db.data.users[id].name = pushName
			}
		}

		return id
	},

	getUser(rawId, pushName = null) {
		const id = sanitizeId(rawId)
		if (!id) return null
		system.addUser(id, pushName)
		return db.data.users[id] || null
	},

	cleanInvalidUsers() {
		const users = db.data.users || {}
		let removed = 0
		for (const id in users) {
			if (!/^\d{7,15}$/.test(id)) {
				delete users[id]
				removed++
			}
		}
		return removed
	},

	getAllUsers() {
		return db.data.users || {}
	},

	async saveDb() {
		try {
			await db.write()
		} catch (e) {
			console.error(chalk.red('❌ Error saving database:'), e)
		}
	},

	cleanInvalidNames() {
		const users = db.data.users || {}
		let fixed = 0
		const invisibleRegex = /^[\s\p{Cf}\p{Zs}\u200B-\u200D\uFEFF]+$/u

		for (const id in users) {
			const name = users[id].name
			if (!name || invisibleRegex.test(name)) {
				users[id].name = 'Unknown'
				fixed++
			}
		}
		return fixed
	},

	// --- Coin & Reward ---
	getCoin(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return 0
		if (system.isPremium(id) || system.isOwner(id)) return Infinity
		return user.coin || 0
	},

	addCoin(rawId, amount) {
		if (amount <= 0) return false
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return false
		user.coin = (user.coin || 0) + amount
		return true
	},

	subtractCoinIfEnough(rawId, amount) {
		if (amount <= 0) return false
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return false
		if ((user.coin || 0) < amount) return false
		if (system.isPremium(id) || system.isOwner(id)) return true
		user.coin -= amount
		return true
	},

	addCoinAll(amount) {
		if (amount <= 0) return false
		const users = system.getAllUsers()
		let count = 0
		for (const id in users) {
			users[id].coin = (users[id].coin || 0) + amount
			count++
		}
		return count
	},

	giveReward(rawId, amount) {
		return system.addCoin(rawId, amount)
	},

	// --- Premium ---
	isPremium(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		return user?.premium || false
	},

	async setPremium(rawId, status) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.premium = !!status
		await system.saveDb()
	},

	// --- Claim system ---
	canClaim(rawId, interval) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return false
		user.lastClaimed ||= {}
		const lastClaim = user.lastClaimed[interval] || 0
		const now = Date.now()

		if (interval === 'daily') {
			const nowMoment = moment().tz('Asia/Jakarta')
			const lastMoment = moment(lastClaim).tz('Asia/Jakarta')
			return (
				nowMoment.date() !== lastMoment.date() ||
				nowMoment.month() !== lastMoment.month() ||
				nowMoment.year() !== lastMoment.year()
			)
		} else if (interval === 'weekly') return now - lastClaim >= 7 * 86400000
		else if (interval === 'monthly') return now - lastClaim >= 30 * 86400000
		else if (interval === 'yearly') return now - lastClaim >= 365 * 86400000

		return false
	},

	async setClaim(rawId, interval) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		const now = Date.now()
		user.lastClaimed ||= {}
		user.claims ||= {}
		user.lastClaimed[interval] = now
		user.claims[interval] = now
		await system.saveDb()
	},

	// --- Owner ---
	async addOwner(rawId) {
		db.data.owner ||= []
		const id = sanitizeId(rawId)
		if (!id) return
		if (!db.data.owner.includes(id)) {
			db.data.owner.push(id)
			await system.saveDb()
		}
	},

	async removeOwner(rawId) {
		const id = sanitizeId(rawId)
		db.data.owner = (db.data.owner || []).filter(o => o !== id)
		await system.saveDb()
	},

	isOwner(rawId) {
		const id = sanitizeId(rawId)
		const dbOwners = db.data.owner || []
		const globalOwners = global.owner || []
		return dbOwners.includes(id) || globalOwners.includes(id)
	},

	getOwnerList() {
		const dbOwners = db.data.owner || []
		return [...new Set([...dbOwners])]
	},

	// --- Blacklist ---
	async removeBl(rawId) {
		const id = sanitizeId(rawId)
		db.data.blacklist = (db.data.blacklist || []).filter(o => o !== id)
		await system.saveDb()
	},

	listBl() {
		return (db.data.blacklist || [])
	},

	// --- Ban & Warn ---
	async banUser(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return false
		user.isBanned = true
		await system.saveDb()
		return true
	},

	async unbanUser(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.isBanned = false
		await system.saveDb()
	},

	isUserBanned(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		return user?.isBanned || false
	},

	async addWarn(rawId, amount = 1) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return 0
		user.warn = (user.warn || 0) + amount
		await system.saveDb()
		return user.warn
	},

	async resetWarn(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.warn = 0
		await system.saveDb()
	},

	getWarn(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		return user?.warn || 0
	},

	// --- Message tracking ---
	async upLastMsg(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.lastMessage = Date.now()
		await system.saveDb()
	},

	lastMsg(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		return user?.lastMessage || 0
	},

	// --- Commands ---
	async addcom(rawId, amount = 1) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.commandCount = (user.commandCount || 0) + amount
		await system.saveDb()
	},

	async recom(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.commandCount = 0
		await system.saveDb()
	},

	cancom(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return false
		if (system.isPremium(id) || system.isOwner(id)) return true
		return (user.commandCount || 0) < (user.limit || 10)
	},

	// --- EXP & Level ---
	async addExp(rawId, amount = 10) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return false
		user.exp = (user.exp || 0) + amount
		let leveledUp = false
		while (user.exp >= user.level * 100) {
			user.exp -= user.level * 100
			user.level++
			system.addCoin(id, user.level * 10)
			leveledUp = true
			console.log(chalk.green(`${id} naik ke level ${user.level}`))
		}
		await system.saveDb()
		return leveledUp
	},

	getTier(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		const coin = user?.coin || 0
		const allUsers = system.getAllUsers()
		const topUser = Object.entries(allUsers).sort((a, b) => (b[1].coin || 0) - (a[1].coin || 0))[0]
		const topUserId = topUser?.[0]
		const topUserCoin = topUser?.[1]?.coin || 0

		if (id && id === topUserId && topUserCoin >= 100000) {
			return {
				name: 'SULTAN',
				badge: '👑 SULTAN'
			}
		}
		if (coin >= 30000) return {
			name: 'Diamond',
			badge: '💎 Diamond'
		}
		if (coin >= 15000) return {
			name: 'Gold',
			badge: '🥇 Gold'
		}
		if (coin >= 5000) return {
			name: 'Silver',
			badge: '🥈 Silver'
		}
		if (coin >= 1000) return {
			name: 'Bronze',
			badge: '🥉 Bronze'
		}
		return {
			name: 'Basic',
			badge: '🪵 Basic'
		}
	},

	getLevel(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		return user?.level || 1
	},

	// --- Profile ---
	async setBio(rawId, text) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.bio = text
		await system.saveDb()
	},

	getBio(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		return user?.bio || ''
	},

	async setName(rawId, name) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.name = name
		await system.saveDb()
	},

	async setStatus(rawId, status) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		if (!user) return
		user.status = status
		await system.saveDb()
	},

	// --- Games ---
	async gamePlayed(rawId) {
		const id = sanitizeId(rawId)
		if (!id) return
		const user = system.getUser(id)
		if (!user) return
		user.gameStats ||= {
			totalPlayed: 0,
			totalWins: 0
		}
		user.gameStats.totalPlayed = (user.gameStats.totalPlayed || 0) + 1
		await system.saveDb()
	},

	async gameWin(rawId) {
		const id = sanitizeId(rawId)
		if (!id) return
		const user = system.getUser(id)
		if (!user) return
		user.gameStats ||= {
			totalPlayed: 0,
			totalWins: 0
		}
		user.gameStats.totalWins = (user.gameStats.totalWins || 0) + 1
		await system.saveDb()
	},

	gameStats(rawId) {
		const id = sanitizeId(rawId)
		const user = system.getUser(id)
		user && (user.gameStats ||= {
			totalPlayed: 0,
			totalWins: 0
		})
		return user?.gameStats || {
			totalPlayed: 0,
			totalWins: 0
		}
	},

	// --- Group mute ---
	async mute(id) {
		db.data.groups ||= {}
		db.data.groups[id] ||= {}
		db.data.groups[id].isMuted = true
		await system.saveDb()
	},

	async unMute(id) {
		db.data.groups ||= {}
		db.data.groups[id] ||= {}
		db.data.groups[id].isMuted = false
		await system.saveDb()
	},

	isMuted(id) {
		return db.data.groups?.[id]?.isMuted === true
	},

	// ------ system ---
	async like(amount = 1) {
		db.data.system ||= {
			like: 0
		}
		db.data.system.like = (db.data.system.like || 0) + amount
		await system.saveDb()
	},

	getLike() {
		return db.data?.system?.like || 0
	},

	set(key, value = true) {
		const defaults = {
			"autoRead": true,
			"lang": "Indonesia",
			"public": true,
			"maintenance": false,
			"autoAI": false,
			"responseToMe": false
		}

		if (!Object.keys(defaults).includes(key)) {
			return m.reply('Key yang dimasukan tidak valid')
		}

		db.data.system ||= {
			...defaults
		}
		db.data.system[key] = value
		return system.saveDb()
	},

	get(key) {
		const defaults = {
			"autoRead": true,
			"lang": "Indonesia",
			"public": true,
			"maintenance": false,
			"autoAI": false,
			"responseToMe": false
		}

		db.data.system ||= {
			...defaults
		}
		return db.data.system[key]
	},
}

export default system