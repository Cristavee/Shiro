export default {
  command: ['shutdown'],
  tag: 'owner',
  owner: true,
  
  async run(criv, { m }) {
    await m.reply('👋 Bot dimatikan.')
    process.exit(0)
  }
}