import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbDir = join(__dirname, 'database')
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true })

const file = join(dbDir, 'data.json')
const adapter = new JSONFile(file)

const systemDefaults = {
  autoRead: true,
  lang: "Indonesia",
  public: true,
  maintenance: false,
  autoAI: false,
  responseToMe: false,
  like: 0
}

const defaults = { 
  users: {}, 
  groups: {}, 
  owner: [], 
  blacklist: [], 
  system: { ...systemDefaults }
}

const db = new Low(adapter, defaults)

await db.read()
db.data ||= { ...defaults }

db.data.users ||= {}
db.data.groups ||= {}
db.data.owner ||= []
db.data.blacklist ||= {}

db.data.system = { ...systemDefaults, ...db.data.system }

await db.write()

export { db, systemDefaults }
export default db