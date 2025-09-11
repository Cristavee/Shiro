export default {
  command: ['mute'],
  tag: 'owner',
  group: true,
  owner: true,
    
async run(criv, { m, system}) {
    
    await system.mute(m.chat)
    m.reply('Bot dimute.')
  }
}