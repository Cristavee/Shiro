export default {
  command: ['restart', 'r'],
  tag: 'owner',
  owner: true,
  public: false,
    async run(criv, { m }) {
        
    await m.reply('Memulai ulang bot...')
    process.exit(0)
  }
}