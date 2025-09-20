export default {
  command: ['hidetag', 'ht'],
  tag: 'group',
  group: true,
  admin: true,
  botAdmin: false,
  coin: 15,
  cooldown: 5000,
  
  async run(criv, { m, args }) {
    const text = args.join(' ').trim()
    if (!text) return m.reply(msg.query)
    
    const metadata = await criv.groupMetadata(m.chat)
    const participants = metadata.participants.map(p => p.id)
    
    await criv.sendMessage(m.chat, {
      text,
      mentions: participants
    })
  }
}