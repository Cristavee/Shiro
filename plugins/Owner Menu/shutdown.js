export default {
  command: ['shutdown'],
  tag: 'owner',
  description: 'Matikan bot',
  owner: true,
  
  async run(criv, { m }) {
    await m.reply('👋 Bot dimatikan.')
    process.exit(0)
  }
}