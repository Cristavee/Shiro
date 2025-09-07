import db from '../../lib/db.js'

export default {
  command: ['resetdb'],
  tag: 'owner',
  description: 'Reset seluruh isi database ke default',
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,

  async run(criv, { m }) {
    const confirm = m.text.toLowerCase().includes('confirm') || m.quoted?.text?.toLowerCase().includes('confirm')

    if (!confirm) {
      return m.reply(
        `⚠️ Ini akan menghapus semua data database bot (user, grup, coin, blacklist, dll).\n\n` +
        `Ketik *resetdb confirm* atau balas dengan "confirm" untuk melanjutkan.`
      )
    }

    const defaultData = {
      users: {},
      groups: {},
      owner: [],
      blacklist: [],
      rooms: {},
      faqUsers: [],
      faqTimeout: 86400000
    }

    db.data = defaultData
    await db.write()

    m.reply('✅ Semua data di database berhasil direset ke default.')
  }
}